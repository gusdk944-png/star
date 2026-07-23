// api/claude.js
const crypto = require("crypto");
// -----------------------------------------------------------------------------
// 이 파일은 "백엔드"예요. 브라우저(손님의 컴퓨터)가 아니라, 여러분의 서버에서만
// 실행돼요. API 키는 여기(서버 환경변수)에만 저장되고, 손님 브라우저에는
// 절대 전달되지 않아요.
//
// ⚠️ 이 버전은 Claude API 대신 "네이버 클로바 스튜디오(CLOVA Studio)"의
// 하이퍼클로바X 모델을 호출해요. 화면(index.html, production.jsx) 코드는 전혀
// 안 바꿔도 돼요 — 이 파일만 서버 역할을 하고, 화면은 그냥 "/api/claude"에
// 물어보기만 하니까요.
//
// 필요한 것 (네이버 클라우드 플랫폼 콘솔 > CLOVA Studio에서 확인):
// 1. NCP_CLOVASTUDIO_API_KEY — CLOVA Studio > API 키 화면에서 발급되는 값
// 2. NCP_CLOVASTUDIO_REQUEST_ID — (선택) 요청을 구분하려고 붙이는 이름표 같은 값이에요.
//    화면에 따로 안 보이면 등록 안 해도 돼요 — 이 코드가 매 요청마다 자동으로 만들어줘요.
// 이 값을 Vercel 프로젝트 설정 > Environment Variables 에 등록해야 동작해요.
// -----------------------------------------------------------------------------

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "허용되지 않는 요청 방식이에요." });
  }

  const { system, prompt, max_tokens } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "prompt(질문 내용)가 없어요." });
  }

  const apiKey = process.env.NCP_CLOVASTUDIO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "서버에 네이버 클로바 API 키가 설정되지 않았어요. 관리자에게 문의하세요.",
    });
  }
  const requestId = process.env.NCP_CLOVASTUDIO_REQUEST_ID || crypto.randomUUID();

  try {
    // HCX-005는 v3 API에서만 지원돼요 (v1에 요청하면 "Unsupported API for model" 오류가 남)
    const response = await fetch("https://clovastudio.stream.ntruss.com/v3/chat-completions/HCX-005", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-NCP-CLOVASTUDIO-REQUEST-ID": requestId,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: system || "" },
          { role: "user", content: prompt },
        ],
        topP: 0.8,
        topK: 0,
        maxTokens: Math.min(max_tokens || 1000, 4096),
        temperature: 0.5,
        repetitionPenalty: 1.1,
        stop: [],
        includeAiFilters: true,
        seed: 0,
      }),
    });

    const data = await response.json();

    if (!response.ok || data?.status?.code !== "20000") {
      return res.status(response.ok ? 500 : response.status).json({
        error: data?.status?.message || "CLOVA Studio API 호출에 실패했어요.",
      });
    }

    const text = data?.result?.message?.content || "";
    const stop_reason = data?.result?.finishReason === "length" ? "max_tokens" : data?.result?.finishReason;

    return res.status(200).json({ text, stop_reason });
  } catch (e) {
    return res.status(500).json({ error: "서버 오류: " + e.message });
  }
};
