# GuteN8 📚

Android-Gute-Nacht-Geschichtenbuch für Bobby, Hoppel, Krümel und Mia.

## Entwicklung

Android WebView mit lokaler HTML/CSS/JS-Oberfläche. GitHub Actions erstellt eine signierte Release-APK und veröffentlicht sie als `guten8-latest`.

## Signierung

Repository-Secrets: `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`. Für Updates muss derselbe Signierschlüssel dauerhaft verwendet werden. Ohne Secrets wird nur ein Debug-Build erstellt, der nicht als reguläres Update der Release-App installiert werden kann.

## Funktionen

Bibliothek, Suche, Favoriten, Lesezeichen, Schriftgröße, Gute-Nacht-Modus, Vorlesen, gespeicherter Lesefortschritt und Updateprüfung über GitHub Releases.

Neue Geschichten in `app/src/main/assets/stories.json` ergänzen. Bilder können unter `app/src/main/assets/images/` abgelegt und in den Geschichten referenziert werden.
