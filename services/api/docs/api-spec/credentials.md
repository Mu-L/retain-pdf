# Credential References

[API spec index](../../API_SPEC.md)

## Credential Reference Contract

The backend-owned credential vault is exposed through authenticated endpoints:

- `GET|POST /api/v1/credentials`
- `GET|PUT|DELETE /api/v1/credentials/:credential_ref`

Create/update accepts a secret once and returns only metadata plus an opaque
`credential_ref`. List/get responses never return the secret or a reversible
masked value. Mutations support `expected_revision` compare-and-swap; stale
writes return `409`. The vault is atomically persisted below the configured
data root with `0700` directory and `0600` file permissions on POSIX systems.
On POSIX systems, mutations are serialized across backend processes through a
private file lock; publishing fsyncs both the replacement file and its parent
directory before the request is reported as successful. Other platforms retain
the in-process mutation lock and atomic replacement behavior.

Translation jobs and document-scoped translation now accept
`translation.credential_ref`. The backend validates the reference at task
creation, persists only the opaque reference, resolves the secret immediately
before launching the worker, and injects it as
`RETAIN_TRANSLATION_API_KEY`. Stage specs contain only the environment
reference. Runtime stdout/stderr, timeout results, failure-AI diagnostics, and
translation replay output are scrubbed with the resolved runtime secret before
being persisted or returned. Retry overrides can switch between the temporary
inline compatibility field and `credential_ref` without retaining both.

Current adoption is translation-only. OCR and Agent payload migration to
credential references remains separate work.

## Credential Errors

Credential-reference resolution owns these machine-readable codes:

| `error.code` | HTTP status | Meaning |
| --- | ---: | --- |
| `CREDENTIAL_REF_INVALID` | 400 | The opaque reference has an invalid shape. |
| `CREDENTIAL_REF_NOT_FOUND` | 404 | No credential exists for the reference. |
| `CREDENTIAL_KIND_MISMATCH` | 400 | The credential exists but cannot be used for the requested purpose. |
| `CREDENTIAL_VAULT_UNAVAILABLE` | 500 | The backend cannot safely read or validate the credential vault. |

For example, a missing reference returns the unified error object while
retaining the existing top-level domain code and message:

```json
{
  "code": "CREDENTIAL_REF_NOT_FOUND",
  "message": "credential reference was not found",
  "error": {
    "code": "CREDENTIAL_REF_NOT_FOUND",
    "http_status": 404,
    "details": {}
  }
}
```

Credential mutation validation and stale `expected_revision` conflicts may use
the generic `BAD_REQUEST`, `NOT_FOUND`, or `CONFLICT` codes. New clients must
read `error.code`; the top-level fields remain available only for compatibility
and currently have no declared removal date. Error bodies never include the
secret, a masked reversible value, vault path, or persisted credential record.

Credential JSON bodies, typed credential paths, and mutation query parameters
also use the shared safe extractor-error contract. Malformed input therefore
returns the unified error object with fixed public messages instead of Axum or
Serde parsing details. Unsupported methods on a matched credential route are
still authenticated before the backend returns `METHOD_NOT_ALLOWED`.

See [Errors, storage, and implementation notes](storage-and-errors.md) for the
shared envelope, extractor mappings, and generic code list.
