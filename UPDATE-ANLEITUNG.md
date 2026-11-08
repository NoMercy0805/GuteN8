# APK-Updates und Signierung

## Wichtig vor der ersten Installation

Android akzeptiert ein Update nur, wenn **Paketname und Signierschlüssel** gleich bleiben und der neue `versionCode` größer ist.

Paketname: `de.nomercy.guten8`

### GitHub Actions Secrets

Unter **Settings → Secrets and variables → Actions** diese Repository-Secrets anlegen:

- `KEYSTORE_BASE64`: Base64-Inhalt der dauerhaft aufbewahrten Release-Keystore-Datei
- `KEYSTORE_PASSWORD`: Passwort des Keystores
- `KEY_ALIAS`: Schlüsselalias
- `KEY_PASSWORD`: Passwort des Schlüssels

Den originalen Keystore **sicher außerhalb von GitHub aufbewahren und sichern**. Bei Verlust kann die App nicht mehr unter demselben Paketnamen als Update signiert werden. Niemals Keystore oder Passwörter ins Repository committen.

Ohne Secrets erstellt die Pipeline nur eine Debug-APK zum Testen. Diese **nicht als endgültige Version verteilen**. Eine Debug-APK kann nicht mit der späteren Release-Signatur aktualisiert werden.

### Update veröffentlichen

1. Änderungen nach `main` pushen. GitHub Actions vergibt automatisch einen höheren `versionCode` und den Versionsnamen `1.0.<GitHub-Run-Nummer>`.
2. GitHub Actions baut die signierte Release-APK und erstellt einen eindeutigen Release-Tag `v1.0.<GitHub-Run-Nummer>` mit `guten8-latest.apk`.
3. Die App prüft beim Start und über Einstellungen GitHub Releases auf eine höhere Version.
4. Nach Bestätigung öffnet sie den APK-Download. Android verlangt gegebenenfalls die Berechtigung, Apps aus dieser Quelle zu installieren. Die Installation muss vom Nutzer bestätigt werden.

**Wichtig:** Die aktuelle App startet einen Download über den externen Browser. Ein vollständig integrierter Installer und eine überprüfte End-to-End-Updateinstallation sind noch nicht implementiert bzw. getestet.

### Voraussetzungen für eine erfolgreiche Aktualisierung

- Signatur gleich wie beim ersten installierten Release
- `applicationId` unverändert
- `versionCode` strikt erhöht
- Release-APK erfolgreich gebaut und öffentlich abrufbar
- Android erlaubt die Installation aus der gewählten Quelle

### Test vor Veröffentlichung

1. Signierte Version 1.0.0 installieren.
2. Favoriten und Lesezeichen speichern.
3. Version 1.0.1 mit höherem `versionCode` veröffentlichen.
4. In der App nach Updates suchen und APK installieren.
5. Prüfen, ob App-Daten und Lesefortschritt erhalten geblieben sind.
