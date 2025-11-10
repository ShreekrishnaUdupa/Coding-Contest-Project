#!/usr/bin/env bash
set -euo pipefail

JOBDIR="$1"
COMMAND="$2"

exec bwrap \
    --unshare-all \
    --unshare-net \
    --cap-drop ALL \
    --ro-bind "$JOBDIR" /app \
    --ro-bind /usr/bin /usr/bin \
    --ro-bind /bin /bin \
    --ro-bind /lib /lib \
    --ro-bind /lib64 /lib64 \
    --ro-bind /usr/lib /usr/lib \
    --ro-bind /usr/lib64 /usr/lib64 \
    --dev /dev \
    --tmpfs /tmp \
    --dir /run \
    --die-with-parent \
    /bin/bash -c "cd /app && ulimit -v 512000 && ulimit -t 3 && exec $COMMAND"