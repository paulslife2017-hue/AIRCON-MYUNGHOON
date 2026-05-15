export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, phone, service, message } = req.body

  if (!name || !phone || !service) {
    return res.status(400).json({ success: false, message: '필수 항목을 입력해주세요.' })
  }

  return res.status(200).json({
    success: true,
    message: '문의가 접수되었습니다. 빠른 시간 내에 연락드리겠습니다.'
  })
}
