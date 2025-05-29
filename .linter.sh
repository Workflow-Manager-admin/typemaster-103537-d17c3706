#!/bin/bash
cd /home/kavia/workspace/code-generation/typemaster-103537-d17c3706/typemaster_web_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

