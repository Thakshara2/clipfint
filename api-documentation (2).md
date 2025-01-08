# Text-to-Speech API Guide

## Making API Requests

### Push Endpoint
```bash
curl "https://mango.sievedata.com/v2/push" \
-X POST \
-H "Content-Type: application/json" \
-H 'X-API-Key: k7vy3cAaTIunBOtYOQTns3pxaOR-vtVRleCasEXdBcs' \
-d '{
    "function": "sieve/tts",
    "inputs": {
        "voice": "elevenlabs-voice-cloning",
        "text": "Hey my name is Rachel and I\'m a female voice. Who are you?",
        "reference_audio": {"url": "https://storage.googleapis.com/sieve-prod-us-central1-public-file-upload-bucket/482b91af-e737-48ea-b76d-4bb22d77fb56/caa0664b-f530-4406-858a-99837eb4b354-input-reference_audio.wav"},
        "emotion": "normal",
        "pace": "normal",
        "stability": 0.9,
        "style": 0.4,
        "word_timestamps": false
    }
}'
```

### Check Job Status
```bash
curl "https://mango.sievedata.com/v2/jobs/{id}" \
-X GET \
-H 'X-API-Key: k7vy3cAaTIunBOtYOQTns3pxaOR-vtVRleCasEXdBcs'
```

## Input Parameters

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| text | str | The text to be spoken |
| voice | string | The voice to be used (see available voices below) |

### Optional Parameters

| Parameter | Type | Options | Description |
|-----------|------|----------|-------------|
| reference_audio | sieve.File | - | Reference audio for voice cloning. Required only when using voice-cloning backend |
| emotion | string | "normal", "anger", "curiosity", "positivity", "suprise", "sadness" | The emotion for the voice (available for cartesia voice engine only) |
| pace | string | "normal", "fast", "slow" | The speaking rate of the voice |
| stability | float | Range: 0-1 | Determines voice stability and generation randomness (available for elevenlabs only) |
| style | float | Range: 0-1 | Determines reference audio influence on the voice (available for elevenlabs only) |
| word_timestamps | bool | true/false | Whether to return timestamps of the spoken audio |

## Available Voices

### Elevenlabs Voices
- elevenlabs-voice-cloning
- elevenlabs-rachel
- elevenlabs-alberto
- elevenlabs-gabriela
- elevenlabs-darine
- elevenlabs-maxime

### OpenAI Voices
- openai-alloy
- openai-echo
- openai-onyx
- openai-nova
- openai-shimmer
- openai-alloy-hd
- openai-echo-hd
- openai-onyx-hd
- openai-nova-hd
- openai-shimmer-hd

### Cartesia Voices
#### English Voices
- cartesia-voice-cloning
- cartesia-reflective-woman
- cartesia-ted
- cartesia-friendly-reading-man
- cartesia-sweet-lady
- cartesia-nonfiction-man
- cartesia-commercial-lady
- cartesia-commercial-man
- cartesia-teacher-lady
- cartesia-friendly-sidekick
- cartesia-tutorial-man
- cartesia-asmr-lady
- cartesia-midwestern-woman
- cartesia-sportsman
- cartesia-storyteller-lady
- cartesia-southern-belle
- cartesia-california-girl
- cartesia-reading-man
- cartesia-wise-man
- cartesia-announcer-man
- cartesia-doctor-mischief
- cartesia-anime-girl
- cartesia-wise-guide-man
- cartesia-the-merchant
- cartesia-madame-mischief
- cartesia-new-york-man
- cartesia-new-york-woman
- cartesia-female-nurse
- cartesia-laidback-woman
- cartesia-alabama-male
- cartesia-midwestern-man
- cartesia-kentucky-man
- cartesia-kentucky-woman
- cartesia-salesman
- cartesia-customer-support-lady
- cartesia-australian-male
- cartesia-australian-woman
- cartesia-yogaman
- cartesia-movieman
- cartesia-wizardman
- cartesia-southern-man
- cartesia-pilot-over-intercom
- cartesia-reading-lady
- cartesia-newsman
- cartesia-child
- cartesia-maria
- cartesia-barbershop-man
- cartesia-meditation-lady
- cartesia-newslady
- cartesia-1920's-radioman
- cartesia-hannah
- cartesia-wise-lady
- cartesia-calm-lady
- cartesia-princess

#### British Voices
- cartesia-british-customer-support-lady
- cartesia-british-reading-lady
- cartesia-british-narration-lady
- cartesia-british-lady
- cartesia-confident-british-man
- cartesia-classy-british-man

#### French Voices
- cartesia-french-conversational-lady
- cartesia-french-narrator-lady
- cartesia-french-narrator-man
- cartesia-stern-french-man
- cartesia-calm-french-woman
- cartesia-helpful-french-lady
- cartesia-friendly-french-man

#### German Voices
- cartesia-german-conversational-woman
- cartesia-german-storyteller-man
- cartesia-friendly-german-man
- cartesia-german-reporter-woman
- cartesia-german-conversation-man
- cartesia-german-woman
- cartesia-german-reporter-man

#### Spanish Voices
- cartesia-spanish-narrator-lady
- cartesia-spanish-narrator-man

#### Chinese Voices
- cartesia-chinese-commercial-man
- cartesia-chinese-woman-narrator
- cartesia-chinese-commercial-woman
- cartesia-chinese-female-conversational
- cartesia-chinese-call-center-man

#### Japanese Voices
- cartesia-japanese-man-book
- cartesia-japanese-children-book
- cartesia-japanese-male-conversational
- cartesia-japanese-woman-conversational

#### Portuguese/Brazilian Voices
- cartesia-friendly-brazilian-man
- cartesia-brazilian-young-man
- cartesia-pleasant-brazilian-lady

#### Indian Voices
- cartesia-indian-customer-support-lady
- cartesia-indian-lady
- cartesia-indian-man

#### Middle Eastern Voices
- cartesia-middle-eastern-woman

## Output

| Parameter | Type |
|-----------|------|
| output_0 | Any |
