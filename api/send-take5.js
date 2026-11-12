import { Resend } from 'resend';

function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
 if(!process.env.RESEND_API_KEY||!process.env.TAKE5_FROM_EMAIL||!process.env.TAKE5_TO_EMAIL) return res.status(500).json({error:'메일 환경변수가 설정되지 않았습니다.'});
 const {fileName,pdfBase64,author,department,process,task,submittedAt}=req.body||{};
 if(!fileName||!pdfBase64||!author||!task) return res.status(400).json({error:'필수 제출정보가 없습니다.'});
 if(pdfBase64.length>5_500_000) return res.status(413).json({error:'PDF가 너무 큽니다.'});
 if(!/^[A-Za-z0-9가-힣._-]+\.pdf$/i.test(fileName)) return res.status(400).json({error:'PDF 파일명이 올바르지 않습니다.'});
 const resend=new Resend(process.env.RESEND_API_KEY);
 try{
  const result=await resend.emails.send({
   from:process.env.TAKE5_FROM_EMAIL,
   to:[process.env.TAKE5_TO_EMAIL],
   subject:`[Take 5] ${department||'N/A'} | ${author} | ${(submittedAt||'').slice(0,10)}`,
   html:`<h2>Höganäs Korea Take 5</h2><p>Take 5 작업 전 점검이 제출되었습니다.</p><table><tr><td><b>작성자</b></td><td>${esc(author)}</td></tr><tr><td><b>부서</b></td><td>${esc(department||'')}</td></tr><tr><td><b>공정/작업장소</b></td><td>${esc(process||'')}</td></tr><tr><td><b>작업</b></td><td>${esc(task)}</td></tr><tr><td><b>제출일시</b></td><td>${esc(submittedAt||'')}</td></tr></table><p>상세 Take 5 체크 결과는 첨부된 PDF를 확인하세요.</p>`,
   attachments:[{filename:fileName,content:pdfBase64}]
  });
  if(result.error) return res.status(502).json({error:result.error.message||'Resend 발송 실패'});
  return res.status(200).json({ok:true,id:result.data?.id});
 }catch(e){return res.status(500).json({error:'메일 발송 중 오류가 발생했습니다.'})}
}
