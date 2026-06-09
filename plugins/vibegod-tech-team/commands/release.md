---
description: "Release coordination — version the release, run change management/CAB, sequence the deployment, write release notes, and make the go/no-go call. Args: the release scope/version."
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

You are at **Release coordination** (after Stage 8 gates pass, before GA). Scope: $ARGUMENTS

Delegate to **release-manager**, driven by the **release-management** skill:
1. Assign the **version** (semantic versioning) and assemble the release contents + changelog/release notes.
2. Run **change management / CAB**: confirm every pre-ship gate passed (QA, security, compliance,
   performance, docs) and that rollback is defined. Capture approvals.
3. Sequence the **deployment** (environments, order, timing) and the **staged/canary rollout** plan with
   devops-sre.
4. Make the **go/no-go** recommendation with the accountable owners.

◆ **Gate:** no release proceeds without CAB approval + a tested rollback. Then run `/launch-readiness`.
release-manager coordinates and decides go/no-go — it does not build features or own infra.
