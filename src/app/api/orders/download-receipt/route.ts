import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chargeId = searchParams.get('chargeId');
    const filename = searchParams.get('filename') || 'receipt.pdf';

    if (!chargeId) {
      return NextResponse.json({ error: 'Missing chargeId' }, { status: 400 });
    }

    const charge = await stripe.charges.retrieve(chargeId);
    if (!charge.receipt_url) {
      return NextResponse.json({ error: 'No receipt URL' }, { status: 404 });
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 720 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(charge.receipt_url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });
    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${decodeURIComponent(filename)}"`,
        'Content-Type': 'application/pdf',
      },
    });
  } catch (error) {
    console.error('Receipt download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate receipt' },
      { status: 500 }
    );
  }
}
