import { NextRequest, NextResponse } from 'next/server'

// PDF generation via @react-pdf/renderer (server-side)
export async function POST(request: NextRequest) {
  try {
    const { output, profile, document_type } = await request.json()

    const { renderToBuffer, Document, Page, Text, View, StyleSheet, Font } =
      await import('@react-pdf/renderer')

    // Register fonts — fallback to built-in if Google Fonts unavailable
    try {
      Font.register({
        family: 'DM Sans',
        fonts: [
          { src: 'https://fonts.gstatic.com/s/dmsans/v14/rP2tp2ywxg089UriI5-g4vlH9VoD8Cmcqbu6-K6z9mXgjU0.woff2', fontWeight: 400 },
          { src: 'https://fonts.gstatic.com/s/dmsans/v14/rP2tp2ywxg089UriI5-g4vlH9VoD8Cmcqbu6-K6z9mXgjU0.woff2', fontWeight: 500 },
        ],
      })
    } catch {
      // Use default font
    }

    const styles = StyleSheet.create({
      page: {
        padding: 60,
        fontFamily: 'Helvetica',
        fontSize: 11,
        lineHeight: 1.6,
        color: '#1a1a1a',
      },
      firmName: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 2,
      },
      firmMeta: {
        fontSize: 10,
        color: '#5a5a5a',
        marginBottom: 1,
      },
      divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0dbd0',
        marginVertical: 16,
      },
      date: {
        fontSize: 10,
        color: '#5a5a5a',
        marginBottom: 24,
      },
      body: {
        fontSize: 11,
        lineHeight: 1.7,
        color: '#1a1a1a',
        whiteSpace: 'pre-wrap',
      },
      signature: {
        marginTop: 32,
      },
      signatureName: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        marginTop: 24,
        marginBottom: 2,
      },
      signatureMeta: {
        fontSize: 10,
        color: '#5a5a5a',
        marginBottom: 1,
      },
    })

    const today = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    const doc = (
      <Document
        title={`${document_type?.replace(/_/g, ' ')} — ${profile?.firm_name || 'Draftly'}`}
        author={profile?.your_name}
      >
        <Page size="LETTER" style={styles.page}>
          {/* Firm header */}
          {profile?.firm_name && (
            <View>
              <Text style={styles.firmName}>{profile.firm_name}</Text>
              {profile.your_name && (
                <Text style={styles.firmMeta}>
                  {profile.your_name}{profile.title ? `, ${profile.title}` : ''}
                </Text>
              )}
              {profile.email && <Text style={styles.firmMeta}>{profile.email}</Text>}
              {profile.phone && <Text style={styles.firmMeta}>{profile.phone}</Text>}
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.date}>{today}</Text>

          <Text style={styles.body}>{output}</Text>

          {/* Signature block */}
          {profile?.your_name && (
            <View style={styles.signature}>
              <Text style={{ fontSize: 11, color: '#5a5a5a' }}>Sincerely,</Text>
              <Text style={styles.signatureName}>{profile.your_name}</Text>
              {profile.title && <Text style={styles.signatureMeta}>{profile.title}</Text>}
              {profile.firm_name && <Text style={styles.signatureMeta}>{profile.firm_name}</Text>}
            </View>
          )}
        </Page>
      </Document>
    )

    const buffer = await renderToBuffer(doc)
    const uint8Array = new Uint8Array(buffer)

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${document_type?.replace(/_/g, '-') || 'document'}.pdf"`,
      },
    })
  } catch (err) {
    console.error('PDF error:', err)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
