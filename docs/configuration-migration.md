# Configuration parity and Pushover design

Source checked: Grizzelbee/ioBroker.mielecloudservice, admin/jsonConfig.json.

Existing CloudService options: sse; Miele_Account; Client_ID; Miele_pwd; Client_secret; oauth2_vg; locale; delayedProcessing; messageDelay; pollInterval; pollUnit.

Unified mapping: sse -> cloudSse; oauth2_vg -> oauthRegion; locale -> locale; delayedProcessing -> delayedProcessing; messageDelay -> messageDelay; pollInterval + pollUnit -> pollSeconds. Account/password-based OAuth flow is NOT yet implemented. Existing token input alone is not equivalent.

Proposed additional settings: mode cloud/local/hybrid, deviceIp, groupId, groupKey; pushoverEnabled, pushoverInstance, notifyFinished, notifyTwinDos, notifyErrors, notifyOffline, pushoverPriority, notificationCooldownSeconds.

Pushover uses the installed ioBroker pushover adapter through sendTo, not a separate Pushover HTTP token. Event detection must consume normalized transitions, and should never infer TwinDos low level without a real device signal. Dedupe events from cloud and LAN before calling the notifier.

Status: design and standalone notification module; not yet wired into main.js, and GUI migration not yet applied. Do not install as a replacement yet.
