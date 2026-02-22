import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { DocumentType, PLAN_LIMITS } from '@/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are a professional document writer for accounting and bookkeeping firms.
Write clear, professional, warm client-facing documents.
Always use proper business letter format.
Never add placeholders like [INSERT X] — if information is missing, write around it naturally.
Output the document body only. No commentary, no markdown formatting, no explanation.
Tone: professional but approachable. Not stiff or legalistic.
Do not include a subject line in the output — that is handled separately.`

type Inputs = Record<string, unknown>

function buildUserPrompt(documentType: DocumentType, inputs: Inputs, profile: Inputs): string {
  const firm = profile.firm_name || 'Our Firm'
  const name = profile.your_name || 'Your Accountant'
  const title = profile.title || 'CPA'

  switch (documentType) {
    case 'engagement_letter': {
      const services = Array.isArray(inputs.services)
        ? (inputs.services as string[]).map((s) => s.replace(/_/g, ' ')).join(', ')
        : String(inputs.services || 'tax preparation')
      const feeStructure = String(inputs.fee_structure || 'flat_fee').replace(/_/g, ' ')
      return `Write a professional engagement letter with the following details:

Firm name: ${firm}
Accountant name and title: ${name}, ${title}
Client name: ${inputs.client_name || 'Valued Client'}
Services to be provided: ${services}
Fee: ${inputs.fee_amount || 'to be discussed'} (${feeStructure})
Engagement year: ${inputs.engagement_year || new Date().getFullYear()}
Client document deadline: ${inputs.doc_deadline || 'to be determined'}
Auto-renews annually: ${inputs.auto_renew ? 'Yes' : 'No'}

The letter must include these sections:
1. Warm greeting
2. Scope of services — list each service clearly
3. Client responsibilities — including document deadline
4. Fees and payment terms
5. Professional closing requesting the client sign and return

Keep the tone warm and clear. The client should feel well taken care of, not like they're reading a legal contract.`
    }

    case 'tax_cover': {
      const result =
        inputs.refund_or_owe === 'refund'
          ? `a refund of ${inputs.amount || 'an amount to be confirmed'}`
          : inputs.refund_or_owe === 'balance_due'
          ? `a balance due of ${inputs.amount || 'an amount to be confirmed'}`
          : 'a breakeven result (no refund, no amount owed)'
      return `Write a professional tax return cover letter with the following details:

Firm name: ${firm}
Accountant name and title: ${name}, ${title}
Client name: ${inputs.client_name || 'Valued Client'}
Tax year: ${inputs.tax_year || new Date().getFullYear() - 1}
Return result: ${result}
Key notes from the return: ${inputs.key_notes || 'No additional notes'}
Action items for the client: ${inputs.action_items || 'Review and sign the enclosed forms'}
${inputs.refund_or_owe === 'balance_due' ? `Payment due date: ${inputs.due_date || 'April 15'}` : ''}

The letter should:
1. Open with a warm summary of the return result
2. Highlight 2-3 notable items from the return in plain language
3. Clearly explain what the client needs to do next
4. Close warmly and invite questions`
    }

    case 'tax_organizer': {
      const changes = Array.isArray(inputs.life_changes) && (inputs.life_changes as string[]).length > 0
        ? (inputs.life_changes as string[]).map((c) => c.replace(/_/g, ' ')).join(', ')
        : 'None noted'
      const entityType = String(inputs.entity_type || 'individual').replace(/_/g, ' ')
      return `Write a professional tax organizer request letter with the following details:

Firm name: ${firm}
Accountant name and title: ${name}, ${title}
Client name: ${inputs.client_name || 'Valued Client'}
Tax year: ${inputs.tax_year || new Date().getFullYear() - 1}
Entity type: ${entityType}
Life changes this year: ${changes}
Document submission deadline: ${inputs.doc_deadline || 'to be confirmed'}

The letter should:
1. Open with a warm, friendly greeting for tax season
2. List the documents they need to gather (tailored to entity type and life changes)
3. Clearly state the deadline and how to submit documents
4. Offer to answer any questions and make the process feel easy`
    }

    case 'extension': {
      const entityType = String(inputs.entity_type || 'individual').replace(/_/g, ' ')
      const reasonMap: Record<string, string> = {
        waiting_on_k1s: 'we are still awaiting K-1 forms from partnerships or S-corporations',
        missing_documents: 'we are still gathering some necessary documentation',
        complexity: 'the complexity of your return requires additional preparation time',
        other: 'additional preparation time is needed to ensure accuracy',
      }
      const reason = reasonMap[String(inputs.reason)] || reasonMap.other
      return `Write a professional tax extension notification letter with the following details:

Firm name: ${firm}
Accountant name and title: ${name}, ${title}
Client name: ${inputs.client_name || 'Valued Client'}
Tax year: ${inputs.tax_year || new Date().getFullYear() - 1}
Entity type: ${entityType}
Reason (explain naturally, don't state it mechanically): ${reason}
New extended deadline: ${inputs.extension_deadline || 'October 15'}
${inputs.estimated_payment_required ? `Estimated tax payment required: Yes — amount: ${inputs.estimated_payment_amount || 'to be determined'}` : 'No estimated payment required'}

The letter should:
1. Reassure the client that filing an extension is routine and common
2. Explain briefly why the extension is being filed (use the reason above naturally)
3. State the new deadline clearly
4. ${inputs.estimated_payment_required ? 'Explain any estimated payment required and its deadline' : 'Confirm no payment is required with the extension'}
5. Close warmly and assure them their return is in good hands`
    }

    case 'welcome': {
      return `Write a warm professional welcome letter with the following details:

Firm name: ${firm}
Accountant name and title: ${name}, ${title}
Client name: ${inputs.client_name || 'Valued Client'}
Services they have signed up for: ${inputs.services_signed_up || 'our professional accounting services'}
${inputs.portal_link ? `Client portal link: ${inputs.portal_link}` : ''}
What happens in the next 30 days: ${inputs.first_steps || 'We will reach out shortly to get everything set up'}

The letter should:
1. Open with genuine warmth — the client should feel excited and confident about their choice
2. Summarize the services they are receiving
3. Walk through the first steps clearly and concisely
4. ${inputs.portal_link ? 'Mention the client portal and encourage them to log in' : ''}
5. Close by inviting them to reach out with any questions`
    }

    case 'disengagement': {
      const toneMap: Record<string, string> = {
        client_request: 'cordial and understanding — the client is leaving voluntarily',
        non_payment: 'professional and firm — ensure outstanding obligations are addressed',
        scope_mismatch: 'professional and clear — the relationship was not a fit',
        ethical: 'professional and neutral — do not disclose the reason',
      }
      const tone = toneMap[String(inputs.reason_internal)] || toneMap.ethical
      const effectiveDate = inputs.effective_date
        ? new Date(inputs.effective_date as string).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'the date of this letter'
      return `Write a professional disengagement letter. Tone guidance (do not disclose this to the client): ${tone}

Firm name: ${firm}
Accountant name and title: ${name}, ${title}
Client name: ${inputs.client_name || 'Valued Client'}
Effective date: ${effectiveDate}
${inputs.outstanding_balance ? `Outstanding balance: ${inputs.outstanding_balance}` : ''}
File retrieval instructions: ${inputs.file_retrieval_instructions || 'Please contact our office to arrange retrieval of your documents'}

The letter must:
1. Professionally notify the client that the engagement is ending as of the effective date
2. Never disclose the internal reason for disengagement
3. ${inputs.outstanding_balance ? `Address the outstanding balance of ${inputs.outstanding_balance} professionally` : ''}
4. Provide clear instructions for retrieving their files
5. Wish them well and close professionally`
    }

    case 'scope_change': {
      const effectiveDate = inputs.effective_date
        ? new Date(inputs.effective_date as string).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'the date specified'
      return `Write a professional scope of services change addendum letter with the following details:

Firm name: ${firm}
Accountant name and title: ${name}, ${title}
Client name: ${inputs.client_name || 'Valued Client'}
Original services: ${inputs.original_services || 'previously agreed services'}
New or updated services: ${inputs.new_services || 'expanded services'}
New fee arrangement: ${inputs.new_fee || 'updated fee to be confirmed'}
Effective date: ${effectiveDate}

The letter should:
1. Reference the existing engagement and explain that this letter serves as an addendum
2. Clearly describe what is changing (services and/or fees)
3. State the effective date of the change
4. Request the client acknowledge by signing or replying
5. Keep the tone warm and collaborative — frame this as a positive step`
    }

    case 'irs_notice': {
      return `Write a professional IRS notice summary letter with the following details:

Firm name: ${firm}
Accountant name and title: ${name}, ${title}
Client name: ${inputs.client_name || 'Valued Client'}
IRS notice type: ${inputs.notice_type || 'IRS Notice'}
What the notice says (in plain language): ${inputs.what_notice_says || 'The IRS has sent a notice requiring a response'}
Action required by the client: ${inputs.action_required || 'Please contact us at your earliest convenience'}
Response deadline: ${inputs.deadline || 'as soon as possible'}
What we are doing on their behalf: ${inputs.what_we_are_doing || 'We are reviewing the notice and will respond appropriately'}

The letter should:
1. Open by acknowledging they received the notice and explaining the purpose of this letter
2. Explain in plain, reassuring language what the IRS notice says — no jargon
3. Be clear about what the client needs to do and by when
4. Explain what your firm is doing to handle it
5. Close reassuringly — the client should feel this is under control`
    }

    default:
      return `Generate a professional accounting firm document for: ${documentType}`
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { document_type, inputs, profile } = body as {
      document_type: DocumentType
      inputs: Inputs
      profile: Inputs
    }

    // Auth check + usage limit
    let userId: string | null = null
    let plan: string = 'free'

    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        userId = user.id

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('plan, status')
          .eq('user_id', user.id)
          .single()

        plan = sub?.plan || 'free'

        // Check plan access
        if (plan === 'free') {
          const freeDocs = PLAN_LIMITS.free.document_types
          if (!freeDocs.includes(document_type)) {
            return NextResponse.json(
              { error: 'plan_required', message: 'This document type requires a Pro plan. Upgrade to access all 8 document types.' },
              { status: 403 }
            )
          }

          // Check monthly usage
          const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
          const { count } = await supabase
            .from('documents')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', startOfMonth)

          if ((count || 0) >= PLAN_LIMITS.free.docs_per_month) {
            return NextResponse.json(
              { error: 'limit_reached', message: "You've reached your free plan limit. Upgrade to Pro for unlimited documents." },
              { status: 403 }
            )
          }
        }
      }
    } catch {
      // Supabase not configured — allow generation for development
    }

    // Call Claude
    const userPrompt = buildUserPrompt(document_type, inputs, profile)

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      system: SYSTEM_PROMPT,
    })

    const output = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('')

    // Save to history if authenticated
    if (userId) {
      try {
        const supabase = await createClient()
        await supabase.from('documents').insert({
          user_id: userId,
          document_type,
          inputs,
          output,
        })
      } catch {
        // Save failure is non-fatal
      }
    }

    return NextResponse.json({ output })
  } catch (err) {
    console.error('Generate error:', err)
    return NextResponse.json(
      { error: 'Failed to generate document. Please try again.' },
      { status: 500 }
    )
  }
}
