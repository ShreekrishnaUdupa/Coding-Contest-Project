#!/usr/bin/env bash
set -euo pipefail

JOBDIR="$1"
COMMAND="$2"

exec bwrap \
  --unshare-all \
  --unshare-net \
  --cap-drop ALL \
  --ro-bind "$JOBDIR" /app \
  --ro-bind /bin /bin \
  --ro-bind /usr/bin /usr/bin \
  --ro-bind /lib /lib \
  --ro-bind /usr/lib /usr/lib \
  --dev /dev \
  --tmpfs /tmp \
  --dir /run \
  --die-with-parent \
  /bin/sh -c "export PATH=/bin:/usr/bin; cd /app; ulimit -v 512000; ulimit -t 3; exec $COMMAND"
