# Höganäs Korea Take 5 - PDF + Resend email build

## What this version does
`Take 5 작성 → PDF 다운로드 → Vercel Function → Resend → 담당자 Outlook`

## GitHub
압축 해제 후 저장소 루트 전체를 덮어쓰고 Commit changes 합니다. `api/send-take5.js`도 반드시 저장소 루트의 `api` 폴더에 있어야 합니다.

## Resend / Vercel settings
1. Resend에서 체험판 발신 도메인 또는 서브도메인을 인증합니다.
2. Vercel Project → Settings → Environment Variables에 아래 3개를 추가합니다.
   - `RESEND_API_KEY`
   - `TAKE5_FROM_EMAIL` 예: `Take 5 <take5@verified.example>`
   - `TAKE5_TO_EMAIL` 담당자 회사 Outlook 주소
3. Environment Variable 추가 후 Vercel에서 새 배포가 일어나야 합니다.

## Security
Resend API Key는 `App.jsx`에 없습니다. Vercel 서버 함수만 키를 읽습니다. 체험판 공개 URL은 남용 가능성이 있으므로 실제 운영 전 rate limiting / CAPTCHA / 인증 중 하나를 추가하세요.

## User flow
`PDF 생성 및 이메일 제출`을 누르면 동일 PDF를 사용자 기기에 다운로드하고 담당자에게 첨부메일로 발송합니다. 메일 발송이 실패하면 화면에 실패 메시지를 표시합니다.
