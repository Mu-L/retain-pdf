import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function schema(name) {
  return JSON.parse(readFileSync(resolve(name), "utf8"));
}

test("runtime config keeps the update and redacted view boundaries explicit", () => {
  const contract = schema("runtime-config.v1.schema.json");
  const update = contract.definitions.RuntimeConfigUpdate;
  const view = contract.definitions.RuntimeConfigView;

  assert.deepEqual(Object.keys(update.properties).sort(), [
    "agent_confirmation_mode",
    "agent_runtime",
    "clear_fx_gateway_api_key",
    "clear_llm_api_key",
    "expected_revision",
    "fx_gateway_api_key",
    "fx_gateway_base_url",
    "fx_model",
    "llm_api_key",
    "llm_base_url",
    "llm_model",
  ]);
  assert.equal(Object.hasOwn(update, "required"), false);
  assert.equal(update.additionalProperties, false);
  assert.deepEqual(contract.definitions.ConfiguredRuntime.enum, ["python", "openai", "fx"]);
  assert.deepEqual(contract.definitions.AgentConfirmationMode.enum, ["explicit", "green_light"]);
  assert.deepEqual(new Set(view.required), new Set(Object.keys(view.properties)));
  assert.equal(view.additionalProperties, false);
  assert.equal(Object.hasOwn(view.properties, "llm_api_key"), false);
  assert.equal(Object.hasOwn(view.properties, "fx_gateway_api_key"), false);
});

test("public operation action mirrors Rust CAS and deny-unknown constraints", () => {
  const contract = schema("public-document-operation.v1.schema.json");
  const action = contract.definitions.PublicDocumentOperationActionInput;
  const view = contract.definitions.PublicDocumentOperationView;
  const list = contract.definitions.PublicDocumentOperationListView;

  assert.equal(action.additionalProperties, false);
  assert.deepEqual(action.required, [
    "schema",
    "idempotency_key",
    "expected_status",
    "expected_attempt",
    "expected_program_sha256",
  ]);
  assert.equal(action.properties.schema.const, "document_operation_action_v1");
  assert.equal(action.properties.expected_attempt.minimum, 1);
  assert.equal(action.properties.expected_program_sha256.pattern, "^[0-9A-Fa-f]{64}$");
  assert.deepEqual(
    contract.definitions.DocumentOperationStatus.enum,
    [
      "draft",
      "awaiting_confirmation",
      "queued",
      "running",
      "validating",
      "result_ready",
      "committed",
      "failed",
      "cancelled",
      "ambiguous",
    ],
  );
  assert.deepEqual(new Set(view.required), new Set(Object.keys(view.properties)));
  assert.deepEqual(new Set(list.required), new Set(Object.keys(list.properties)));
  assert.deepEqual(list.required, ["operations", "total", "limit", "offset", "has_more"]);
  assert.equal(list.properties.limit.minimum, 1);
  assert.equal(list.properties.limit.maximum, 100);
});
