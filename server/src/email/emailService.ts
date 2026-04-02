import { Resend } from 'resend'

type StudentRecipient = {
  email: string
  name: string
}

type CourseRecipient = {
  slug: string
  title: string
}

const resendApiKey = process.env.RESEND_API_KEY?.trim()
const resendFrom = process.env.RESEND_FROM?.trim() || 'Yousef LMS <onboarding@resend.dev>'
const frontendUrl = process.env.FRONTEND_URL?.trim() || 'http://localhost:5173'
const resend = resendApiKey ? new Resend(resendApiKey) : null

async function sendEmail(options: {
  subject: string
  to: StudentRecipient
  html: string
}) {
  if (!resend) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('Resend is not configured; email notification skipped.')
    }

    return
  }

  await resend.emails.send({
    from: resendFrom,
    to: options.to.email,
    subject: options.subject,
    html: options.html,
  })
}

export async function sendApprovalEmail(
  student: StudentRecipient,
  course: CourseRecipient,
) {
  const courseUrl = `${frontendUrl.replace(/\/+$/, '')}/courses/${course.slug}`

  await sendEmail({
    to: student,
    subject: `تم قبول طلبك في دورة ${course.title}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #0f172a;">
        <h2>مرحباً ${student.name}</h2>
        <p>تمت الموافقة على طلبك للدخول إلى دورة <strong>${course.title}</strong>.</p>
        <p>يمكنك الآن بدء التعلم مباشرة من خلال الرابط التالي:</p>
        <p><a href="${courseUrl}">فتح الدورة</a></p>
        <p>بالتوفيق في رحلتك التعليمية.</p>
      </div>
    `,
  })
}

export async function sendRejectionEmail(
  student: StudentRecipient,
  course: CourseRecipient,
  reason?: string | null,
) {
  await sendEmail({
    to: student,
    subject: `تم تحديث طلبك في دورة ${course.title}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #0f172a;">
        <h2>مرحباً ${student.name}</h2>
        <p>تم رفض طلبك الخاص بدورة <strong>${course.title}</strong>.</p>
        <p>السبب: ${reason?.trim() || 'لم يتم إضافة سبب من الإدارة.'}</p>
        <p>يمكنك إعادة رفع إثبات دفع جديد من داخل المنصة عند الحاجة.</p>
      </div>
    `,
  })
}
