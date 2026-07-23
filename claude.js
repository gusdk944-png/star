// api/claude.js
// -----------------------------------------------------------------------------
// 이 파일은 "백엔드"예요. 브라우저(손님의 컴퓨터)가 아니라, 여러분의 서버에서만
// 실행돼요. Claude API 키는 여기(서버 환경변수)에만 저장되고, 손님 브라우저에는
// 절대 전달되지 않아요.
//
// Vercel(https://vercel.com)에 그대로 올리면 자동으로 작동하는 "서버리스 함수"
// 형식으로 작성했어요. Vercel 프로젝트 설정 > Environment Variables 에서
// ANTHROPIC_API_KEY 라는 이름으로 실제 API 키를 등록해야 동작해요.
// -----------------------------------------------------------------------------

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "허용되지 않는 요청 방식이에요." });
  }

  const { system, prompt, max_tokens } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "prompt(질문 내용)가 없어요." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // 서버에 키가 등록 안 돼 있으면 여기서 바로 막아요 (배포 설정 실수를 빨리 알아채기 위함)
    return res.status(500).json({ error: "서버에 API 키가 설정되지 않았어요. 관리자에게 문의하세요." });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: max_tokens || 1000,
        system,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data?.error?.message || "Claude API 호출에 실패했어요." });
    }

    const text = (data.content || [])
      .map((block) => (block.type === "text" ? block.text : ""))
      .filter(Boolean)
      .join("\n");

    return res.status(200).json({ text, stop_reason: data.stop_reason });
  } catch (e) {
    return res.status(500).json({ error: "서버 오류: " + e.message });
  }
}
