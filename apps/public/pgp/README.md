# Sky Genesis Enterprise OpenPGP Public Files

This directory contains the public artifacts exposed by the Trust & Verification page:

- `sky-genesis-enterprise.asc`: ASCII Armored OpenPGP public key
- `sky-genesis-enterprise.gpg`: binary OpenPGP public key export
- `sky-genesis-enterprise-fingerprint.txt`: human-readable fingerprint reference

## Current Status

The repository does not currently contain an official generated Sky Genesis Enterprise OpenPGP public key.

The `.asc`, `.gpg`, and fingerprint files in this directory are placeholders and must be replaced before production use.

## How To Replace The Placeholders

1. Generate or import the official OpenPGP keypair in a secure environment.
2. Export the ASCII armored public key:

```bash
gpg --armor --export <official-key-id> > sky-genesis-enterprise.asc
```

3. Export the binary public key:

```bash
gpg --export --output sky-genesis-enterprise.gpg <official-key-id>
```

4. Extract the fingerprint:

```bash
gpg --fingerprint <official-key-id>
```

5. Update `sky-genesis-enterprise-fingerprint.txt` with the real fingerprint, key ID, creation date, and status.
6. Update the translations and page copy if the fingerprint displayed on the Trust & Verification page changes.

## Recommended Verification Workflow

- Keep the fingerprint file synchronized with the actual exported key.
- Cross-check the published fingerprint on the website, `security.txt`, and other official channels.
- Regenerate the binary export whenever the public key is rotated or renewed.
