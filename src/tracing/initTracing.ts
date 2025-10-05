import { WebTracerProvider } from '@opentelemetry/sdk-trace-web'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch'
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request'
import { trace } from '@opentelemetry/api'

// Configure your exporter (e.g. console or OTLP endpoint)
const exporter = new OTLPTraceExporter({
  url: process.env.NEXT_PUBLIC_OTEL_EXPORTER_URL || 'http://localhost:4318/v1/traces',
})

// Create tracer provider
const provider = new WebTracerProvider()
provider.addSpanProcessor(new BatchSpanProcessor(exporter))
provider.register()

// Auto-instrument fetch + xhr
registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation(),
    new XMLHttpRequestInstrumentation(),
  ],
})

// Export tracer
export const tracer = trace.getTracer('solana-ui')
