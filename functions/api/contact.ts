export async function onRequestPost(context: any) {
  try {
    const data = await context.request.json();
    const { name, email, phone, checkin, checkout, message } = data as any;
    
    const apiKey = context.env.RESEND_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY configuration." }), { status: 500 });
    }

    const fromEmail = "onboarding@resend.dev"; 
    const toEmail = "initindogra@gmail.com";
    
    const htmlContent = `
        <h3>New Booking Request - Sojha Pinecone</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Dates:</strong> ${checkin} to ${checkout}</p>
        <p><strong>Message:</strong><br>${message}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        subject: `New Booking Query from ${name}`,
        html: htmlContent
      })
    });

    if (res.ok) {
      return Response.json({ status: "success", message: "Email sent securely." });
    } else {
      const errorText = await res.text();
      return new Response(JSON.stringify({ error: "Failed to send email", details: errorText }), { status: 500 });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
