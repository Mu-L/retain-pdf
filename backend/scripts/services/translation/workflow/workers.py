from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class TranslationBatchRunStats:
    pending_items: int
    total_batches: int
    effective_batch_size: int
    flush_interval: int
    effective_workers: int
    batched_fast_batches: int
    single_fast_batches: int
    single_slow_batches: int
    batched_fast_workers: int = 0
    single_fast_workers: int = 0
    single_slow_workers: int = 0
    slow_worker_limit: int = 0

    def as_dict(self) -> dict[str, int]:
        fast_queue_workers = self.batched_fast_workers + self.single_fast_workers
        return {
            "pending_items": self.pending_items,
            "total_batches": self.total_batches,
            "effective_batch_size": self.effective_batch_size,
            "flush_interval": self.flush_interval,
            "effective_workers": self.effective_workers,
            "fast_queue_batches": self.batched_fast_batches + self.single_fast_batches,
            "slow_queue_batches": self.single_slow_batches,
            "fast_queue_workers": fast_queue_workers,
            "batched_fast_batches": self.batched_fast_batches,
            "single_fast_batches": self.single_fast_batches,
            "single_slow_batches": self.single_slow_batches,
            "batched_fast_workers": self.batched_fast_workers,
            "single_fast_workers": self.single_fast_workers,
            "single_slow_workers": self.single_slow_workers,
            "slow_worker_limit": self.slow_worker_limit,
        }


def _empty_worker_allocation() -> dict[str, int]:
    return {
        "batched_fast": 0,
        "single_fast": 0,
        "single_slow": 0,
    }


def _single_worker_allocation(*, batched_fast_count: int, single_fast_count: int, single_slow_count: int) -> dict[str, int]:
    allocation = _empty_worker_allocation()
    first_queue = next(
        (
            name
            for name, count in (
                ("batched_fast", batched_fast_count),
                ("single_fast", single_fast_count),
                ("single_slow", single_slow_count),
            )
            if count > 0
        ),
        "",
    )
    if first_queue:
        allocation[first_queue] = 1
    return allocation


def _slow_worker_cap(workers: int, single_slow_count: int = 0) -> int:
    if single_slow_count <= 0:
        return 0
    if workers <= 8:
        base = 1
    elif workers <= 24:
        base = 2
    else:
        base = min(4, max(2, workers // 8))
    backlog_scaled = max(base, max(1, workers // 4))
    return min(single_slow_count, backlog_scaled)


def _adaptive_floor_limit(workers: int) -> int:
    return max(1, min(8, max(1, workers)))


def _adaptive_initial_limit(workers: int) -> int:
    worker_count = max(1, int(workers))
    if worker_count <= 32:
        return worker_count
    return min(worker_count, 32)


def _fast_queue_targets(*, batched_fast_count: int, single_fast_count: int) -> list[tuple[str, int]]:
    return [
        (name, count)
        for name, count in (
            ("batched_fast", batched_fast_count),
            ("single_fast", single_fast_count),
        )
        if count > 0
    ]


def _weighted_fast_queue_targets(*, batched_fast_count: int, single_fast_count: int) -> list[tuple[str, int]]:
    targets: list[tuple[str, int]] = []
    if batched_fast_count > 0:
        targets.append(("batched_fast", max(1, batched_fast_count)))
    if single_fast_count > 0:
        targets.append(("single_fast", max(1, single_fast_count)))
    return targets


def _distribute_extra_workers(remaining_after_floor: int, fast_targets: list[tuple[str, int]]) -> dict[str, int]:
    total_fast_batches = sum(count for _, count in fast_targets)
    if remaining_after_floor <= 0 or total_fast_batches <= 0:
        return {name: 0 for name, _count in fast_targets}
    extras: dict[str, int] = {}
    assigned = 0
    for index, (name, count) in enumerate(fast_targets):
        extra = (
            remaining_after_floor - assigned
            if index == len(fast_targets) - 1
            else (remaining_after_floor * count) // total_fast_batches
        )
        assigned += extra
        extras[name] = extra
    return extras


def _allocate_translation_queue_workers(
    total_workers: int,
    *,
    batched_fast_count: int,
    single_fast_count: int,
    single_slow_count: int,
    slow_worker_limit: int | None = None,
) -> dict[str, int]:
    workers = max(1, total_workers)
    allocation = _empty_worker_allocation()
    if workers == 1:
        return _single_worker_allocation(
            batched_fast_count=batched_fast_count,
            single_fast_count=single_fast_count,
            single_slow_count=single_slow_count,
        )

    fast_targets = _fast_queue_targets(
        batched_fast_count=batched_fast_count,
        single_fast_count=single_fast_count,
    )
    fast_queue_floor = len(fast_targets)

    if single_slow_count > 0:
        slow_cap = _slow_worker_cap(workers, single_slow_count) if slow_worker_limit is None else max(0, int(slow_worker_limit))
        slow_capacity = workers if not fast_targets else max(0, workers - fast_queue_floor)
        allocation["single_slow"] = min(single_slow_count, slow_cap, slow_capacity)

    remaining = workers - allocation["single_slow"]

    if not fast_targets:
        allocation["single_slow"] = workers
        return allocation
    if len(fast_targets) == 1:
        allocation[fast_targets[0][0]] = remaining
        return allocation

    remaining_after_floor = remaining - len(fast_targets)
    for name, _count in fast_targets:
        allocation[name] = 1
    weighted_targets = _weighted_fast_queue_targets(
        batched_fast_count=batched_fast_count,
        single_fast_count=single_fast_count,
    )
    for name, extra in _distribute_extra_workers(remaining_after_floor, weighted_targets).items():
        allocation[name] += extra
    return allocation


__all__ = [
    "TranslationBatchRunStats",
    "_adaptive_floor_limit",
    "_adaptive_initial_limit",
    "_allocate_translation_queue_workers",
    "_distribute_extra_workers",
    "_empty_worker_allocation",
    "_fast_queue_targets",
    "_weighted_fast_queue_targets",
    "_single_worker_allocation",
    "_slow_worker_cap",
]
