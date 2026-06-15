import * as React from "react";
import { getTranslations } from "next-intl/server";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  BadgeAlert,
  Bot,
  BrainCircuit,
  Building2,
  Cloud,
  Globe2,
  KeyRound,
  Layers3,
  LockKeyhole,
  Network,
  Radar,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldEllipsis,
  Waypoints,
  Workflow,
  Zap,
} from "lucide-react";
import {
  CompanyCardGrid,
  CompanyFinalCta,
  CompanyHero,
  CompanyPageShell,
  CompanyPillList,
  CompanySection,
  CompanySplitList,
} from "@/components/public/company/company-page";
import { cn } from "@/lib/utils";

interface UnderAttackOnlinePageProps {
  locale: string;
}

interface LinkAction {
  label: string;
  href: string;
  variant?: "default" | "outline";
}

interface InfoCard {
  title: string;
  description: string;
  meta?: string;
  icon?: LucideIcon;
}

interface TimelineStep {
  label: string;
  title: string;
  description: string;
  active?: boolean;
}

function localizeHref(locale: string, href: string) {
  if (href.startsWith("http") || href.startsWith("mailto:")) {
    return href;
  }

  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

function AttackHeroVisual({
  title,
  badge,
  status,
  statusMeta,
  liveLabel,
  trafficLabel,
  trafficValue,
  requestsLabel,
  requestsValue,
  mitigationLabel,
  mitigationValue,
  mitigationPathLabel,
  pathLabels,
  footer,
}: {
  title: string;
  badge: string;
  status: string;
  statusMeta: string;
  liveLabel: string;
  trafficLabel: string;
  trafficValue: string;
  requestsLabel: string;
  requestsValue: string;
  mitigationLabel: string;
  mitigationValue: string;
  mitigationPathLabel: string;
  pathLabels: [string, string, string];
  footer: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-4xl border border-zinc-200/80 bg-white p-5 shadow-[0_32px_100px_-52px_rgba(15,23,42,0.3)] sm:p-6">
      <div
        aria-hidden={true}
        className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.14),transparent_55%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_45%),linear-gradient(180deg,rgba(244,244,245,0.96),rgba(255,255,255,0))]"
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{title}</div>
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex h-3 w-3 rounded-full bg-red-500 shadow-[0_0_0_6px_rgba(239,68,68,0.12)]" />
              <div className="text-2xl font-semibold tracking-[-0.04em] text-zinc-950">{status}</div>
            </div>
            <p className="mt-2 text-sm text-zinc-600">{statusMeta}</p>
          </div>
          <div className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">{badge}</div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: trafficLabel, value: trafficValue, tone: "bg-red-50 text-red-700 border-red-100" },
            { label: requestsLabel, value: requestsValue, tone: "bg-blue-50 text-blue-700 border-blue-100" },
            { label: mitigationLabel, value: mitigationValue, tone: "bg-emerald-50 text-emerald-700 border-emerald-100" },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50/80 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{item.label}</div>
              <div className="mt-3 flex items-center gap-3">
                <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]", item.tone)}>
                  {liveLabel}
                </span>
                <span className="text-2xl font-semibold tracking-[-0.04em] text-zinc-950">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-zinc-200 bg-zinc-950 p-5 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">{mitigationPathLabel}</div>
              <div className="mt-2 text-lg font-semibold">{footer}</div>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              {[ShieldAlert, Radar, ShieldCheck].map((Icon) => (
                <span
                  key={Icon.displayName ?? Icon.name}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
                >
                  <Icon className="h-5 w-5" />
                </span>
              ))}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {pathLabels.map((label, index) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">{label}</div>
                <div className="mt-3 flex items-center gap-2">
                  <div className={cn("h-2.5 w-full rounded-full bg-white/10", index < 2 && "relative overflow-hidden")}>
                    {index < 2 ? <div className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-white/70" /> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttackSignalRail({ items }: { items: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={item}
          className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur transition duration-300 hover:border-white/16 hover:bg-white/7"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white">
              <BadgeAlert className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-5 text-lg font-semibold tracking-[-0.03em] text-white">{item}</div>
        </div>
      ))}
    </div>
  );
}

function TimelineStrip({ items, activeLabel }: { items: TimelineStep[]; activeLabel: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-6">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "relative overflow-hidden rounded-[1.75rem] border p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.2)]",
            item.active ? "border-blue-200 bg-blue-50/80" : "border-zinc-200/80 bg-white",
          )}
        >
          <div
            className={cn(
              "inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
              item.active ? "border-blue-200 bg-white text-blue-700" : "border-zinc-200 bg-zinc-50 text-zinc-500",
            )}
          >
            {item.active ? activeLabel : item.label}
          </div>
          <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-zinc-950">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-600">{item.description}</p>
          {item.active ? (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-blue-500 via-cyan-400 to-emerald-400" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function SecurityOperationsBoard({
  title,
  subtitle,
  liveLabel,
  trafficProfileLabel,
  adaptiveLabel,
  events,
  metrics,
}: {
  title: string;
  subtitle: string;
  liveLabel: string;
  trafficProfileLabel: string;
  adaptiveLabel: string;
  events: Array<{ label: string; value: string }>;
  metrics: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-[0_32px_100px_-52px_rgba(0,0,0,0.55)] backdrop-blur">
      <div className="grid gap-px bg-white/10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-zinc-950/85 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">{title}</div>
              <div className="mt-2 text-lg font-semibold text-white">{subtitle}</div>
            </div>
            <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
              {liveLabel}
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {events.map((event) => (
              <div key={event.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-medium text-white">{event.label}</div>
                  <div className="text-sm font-semibold text-white/70">{event.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">{metric.label}</div>
                <div className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{metric.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              <span>{trafficProfileLabel}</span>
              <span>{adaptiveLabel}</span>
            </div>
            <div className="mt-4 grid grid-cols-12 items-end gap-2">
              {[26, 34, 28, 52, 65, 72, 68, 48, 41, 56, 44, 38].map((height, index) => (
                <div key={index} className="rounded-full bg-linear-to-t from-blue-500 to-cyan-300" style={{ height }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivationFlow({
  steps,
  note,
}: {
  steps: Array<{ title: string; description: string }>;
  note: string;
}) {
  return (
    <div className="rounded-4xl border border-zinc-200/80 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.24)] sm:p-8">
      <div className="grid gap-4 xl:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.title} className="relative rounded-[1.75rem] border border-zinc-200 bg-zinc-50/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700">
                <Workflow className="h-5 w-5" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-zinc-950">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-600">{step.description}</p>
            {index < steps.length - 1 ? (
              <ArrowRight className="absolute -right-2 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-zinc-300 xl:block" />
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm leading-7 text-emerald-900">
        {note}
      </div>
    </div>
  );
}

export async function UnderAttackOnlinePage({ locale }: UnderAttackOnlinePageProps) {
  const t = await getTranslations({ locale, namespace: "Public.underAttackOnline" });

  const heroActions: LinkAction[] = [
    { label: t("hero.primaryCta"), href: localizeHref(locale, "/security") },
    { label: t("hero.secondaryCta"), href: localizeHref(locale, "/company/contact"), variant: "outline" },
  ];

  const attackSignals = Array.from({ length: 6 }, (_, index) => t(`attackSignals.items.${index}`));

  const attackTypes: InfoCard[] = [
    { title: t("attackTypes.items.ddos.title"), description: t("attackTypes.items.ddos.description"), icon: ShieldAlert },
    { title: t("attackTypes.items.layer7.title"), description: t("attackTypes.items.layer7.description"), icon: Layers3 },
    { title: t("attackTypes.items.bots.title"), description: t("attackTypes.items.bots.description"), icon: Bot },
    { title: t("attackTypes.items.credentialStuffing.title"), description: t("attackTypes.items.credentialStuffing.description"), icon: KeyRound },
    { title: t("attackTypes.items.apiAbuse.title"), description: t("attackTypes.items.apiAbuse.description"), icon: Network },
    { title: t("attackTypes.items.scraping.title"), description: t("attackTypes.items.scraping.description"), icon: Globe2 },
    { title: t("attackTypes.items.dnsFloods.title"), description: t("attackTypes.items.dnsFloods.description"), icon: Radar },
    { title: t("attackTypes.items.bruteForce.title"), description: t("attackTypes.items.bruteForce.description"), icon: LockKeyhole },
  ];

  const timeline: TimelineStep[] = [
    { label: "01", title: t("attackTimeline.items.reconnaissance.title"), description: t("attackTimeline.items.reconnaissance.description") },
    { label: "02", title: t("attackTimeline.items.preparation.title"), description: t("attackTimeline.items.preparation.description") },
    { label: "03", title: t("attackTimeline.items.attack.title"), description: t("attackTimeline.items.attack.description"), active: true },
    { label: "04", title: t("attackTimeline.items.saturation.title"), description: t("attackTimeline.items.saturation.description") },
    { label: "05", title: t("attackTimeline.items.interruption.title"), description: t("attackTimeline.items.interruption.description") },
    { label: "06", title: t("attackTimeline.items.restoration.title"), description: t("attackTimeline.items.restoration.description") },
  ];

  const edgeProtection = [
    { title: t("edgeProtection.items.globalFiltering.title"), description: t("edgeProtection.items.globalFiltering.description") },
    { title: t("edgeProtection.items.edgeNetwork.title"), description: t("edgeProtection.items.edgeNetwork.description") },
    { title: t("edgeProtection.items.rateLimiting.title"), description: t("edgeProtection.items.rateLimiting.description") },
    { title: t("edgeProtection.items.waf.title"), description: t("edgeProtection.items.waf.description") },
    { title: t("edgeProtection.items.cdn.title"), description: t("edgeProtection.items.cdn.description") },
    { title: t("edgeProtection.items.realTimeMitigation.title"), description: t("edgeProtection.items.realTimeMitigation.description") },
  ];

  const ddosProtection: InfoCard[] = [
    { title: t("ddosProtection.items.networkMitigation.title"), description: t("ddosProtection.items.networkMitigation.description"), icon: Shield },
    { title: t("ddosProtection.items.trafficAbsorption.title"), description: t("ddosProtection.items.trafficAbsorption.description"), icon: Cloud },
    { title: t("ddosProtection.items.multiLayerFiltering.title"), description: t("ddosProtection.items.multiLayerFiltering.description"), icon: ShieldEllipsis },
    { title: t("ddosProtection.items.availability.title"), description: t("ddosProtection.items.availability.description"), icon: Zap },
  ];

  const apiProtection = [
    { title: t("apiProtection.items.gateway.title"), description: t("apiProtection.items.gateway.description") },
    { title: t("apiProtection.items.rateLimits.title"), description: t("apiProtection.items.rateLimits.description") },
    { title: t("apiProtection.items.jwtValidation.title"), description: t("apiProtection.items.jwtValidation.description") },
    { title: t("apiProtection.items.abuseProtection.title"), description: t("apiProtection.items.abuseProtection.description") },
    { title: t("apiProtection.items.observability.title"), description: t("apiProtection.items.observability.description") },
  ];

  const identityProtection = [
    { title: t("identityProtection.items.mfa.title"), description: t("identityProtection.items.mfa.description") },
    { title: t("identityProtection.items.loginProtection.title"), description: t("identityProtection.items.loginProtection.description") },
    { title: t("identityProtection.items.sessionSecurity.title"), description: t("identityProtection.items.sessionSecurity.description") },
    { title: t("identityProtection.items.suspiciousAttempts.title"), description: t("identityProtection.items.suspiciousAttempts.description") },
  ];

  const dnsProtection: InfoCard[] = [
    { title: t("dnsProtection.items.monitoring.title"), description: t("dnsProtection.items.monitoring.description"), icon: Activity },
    { title: t("dnsProtection.items.firewall.title"), description: t("dnsProtection.items.firewall.description"), icon: ShieldCheck },
    { title: t("dnsProtection.items.redundancy.title"), description: t("dnsProtection.items.redundancy.description"), icon: Waypoints },
    { title: t("dnsProtection.items.floodDefense.title"), description: t("dnsProtection.items.floodDefense.description"), icon: Radar },
  ];

  const botProtection = [
    { title: t("botProtection.items.legitimateBots.title"), description: t("botProtection.items.legitimateBots.description") },
    { title: t("botProtection.items.maliciousBots.title"), description: t("botProtection.items.maliciousBots.description") },
    { title: t("botProtection.items.scraping.title"), description: t("botProtection.items.scraping.description") },
    { title: t("botProtection.items.fakeUsers.title"), description: t("botProtection.items.fakeUsers.description") },
    { title: t("botProtection.items.abusiveAutomation.title"), description: t("botProtection.items.abusiveAutomation.description") },
  ];

  const useCases: InfoCard[] = [
    { title: t("useCases.items.saas.title"), description: t("useCases.items.saas.description"), icon: Cloud },
    { title: t("useCases.items.banking.title"), description: t("useCases.items.banking.description"), icon: ShieldCheck },
    { title: t("useCases.items.ecommerce.title"), description: t("useCases.items.ecommerce.description"), icon: Globe2 },
    { title: t("useCases.items.government.title"), description: t("useCases.items.government.description"), icon: Building2 },
    { title: t("useCases.items.criticalInfrastructure.title"), description: t("useCases.items.criticalInfrastructure.description"), icon: Network },
    { title: t("useCases.items.media.title"), description: t("useCases.items.media.description"), icon: Layers3 },
  ];

  const activationSteps = [
    { title: t("activation.items.addDomain.title"), description: t("activation.items.addDomain.description") },
    { title: t("activation.items.configureDns.title"), description: t("activation.items.configureDns.description") },
    { title: t("activation.items.enableProtection.title"), description: t("activation.items.enableProtection.description") },
    { title: t("activation.items.trafficSecured.title"), description: t("activation.items.trafficSecured.description") },
  ];

  const ecosystem: InfoCard[] = [
    { title: t("ecosystem.items.aetherEdge.title"), description: t("ecosystem.items.aetherEdge.description"), icon: ShieldCheck },
    { title: t("ecosystem.items.aetherIdentity.title"), description: t("ecosystem.items.aetherIdentity.description"), icon: KeyRound },
    { title: t("ecosystem.items.aetherVault.title"), description: t("ecosystem.items.aetherVault.description"), icon: LockKeyhole },
    { title: t("ecosystem.items.aetherVpn.title"), description: t("ecosystem.items.aetherVpn.description"), icon: Globe2 },
    { title: t("ecosystem.items.aetherCloud.title"), description: t("ecosystem.items.aetherCloud.description"), icon: Cloud },
    { title: t("ecosystem.items.apiStudios.title"), description: t("ecosystem.items.apiStudios.description"), icon: Network },
    { title: t("ecosystem.items.aetherOffice.title"), description: t("ecosystem.items.aetherOffice.description"), icon: BrainCircuit },
  ];

  const finalActions: LinkAction[] = [
    { label: t("finalCta.primaryCta"), href: localizeHref(locale, "/platform") },
    { label: t("finalCta.secondaryCta"), href: localizeHref(locale, "/company/contact"), variant: "outline" },
    { label: t("finalCta.tertiaryCta"), href: localizeHref(locale, "/security"), variant: "outline" },
  ];

  return (
    <CompanyPageShell locale={locale}>
      <CompanyHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
        actions={heroActions}
        visual={
          <AttackHeroVisual
            title={t("hero.visual.title")}
            badge={t("hero.visual.badge")}
            status={t("hero.visual.status")}
            statusMeta={t("hero.visual.statusMeta")}
            liveLabel={t("hero.visual.liveLabel")}
            trafficLabel={t("hero.visual.trafficLabel")}
            trafficValue={t("hero.visual.trafficValue")}
            requestsLabel={t("hero.visual.requestsLabel")}
            requestsValue={t("hero.visual.requestsValue")}
            mitigationLabel={t("hero.visual.mitigationLabel")}
            mitigationValue={t("hero.visual.mitigationValue")}
            mitigationPathLabel={t("hero.visual.mitigationPathLabel")}
            pathLabels={[
              t("hero.visual.pathLabels.0"),
              t("hero.visual.pathLabels.1"),
              t("hero.visual.pathLabels.2"),
            ]}
            footer={t("hero.visual.footer")}
          />
        }
      />

      <CompanySection
        eyebrow={t("attackSignals.eyebrow")}
        title={t("attackSignals.title")}
        description={t("attackSignals.description")}
        tone="dark"
      >
        <AttackSignalRail items={attackSignals} />
      </CompanySection>

      <CompanySection
        eyebrow={t("attackTypes.eyebrow")}
        title={t("attackTypes.title")}
        description={t("attackTypes.description")}
      >
        <CompanyCardGrid items={attackTypes} />
      </CompanySection>

      <CompanySection
        eyebrow={t("attackTimeline.eyebrow")}
        title={t("attackTimeline.title")}
        description={t("attackTimeline.description")}
        tone="muted"
      >
        <TimelineStrip items={timeline} activeLabel={t("attackTimeline.activeLabel")} />
      </CompanySection>

      <CompanySection
        eyebrow={t("edgeProtection.eyebrow")}
        title={t("edgeProtection.title")}
        description={t("edgeProtection.description")}
      >
        <div className="space-y-8">
          <CompanySplitList items={edgeProtection} />
          <CompanyPillList
            items={[
              t("edgeProtection.pills.0"),
              t("edgeProtection.pills.1"),
              t("edgeProtection.pills.2"),
              t("edgeProtection.pills.3"),
              t("edgeProtection.pills.4"),
            ]}
          />
        </div>
      </CompanySection>

      <CompanySection
        eyebrow={t("ddosProtection.eyebrow")}
        title={t("ddosProtection.title")}
        description={t("ddosProtection.description")}
        tone="muted"
      >
        <div className="space-y-8">
          <CompanyCardGrid items={ddosProtection} columns="two" />
          <CompanyPillList
            items={[
              t("ddosProtection.pills.0"),
              t("ddosProtection.pills.1"),
              t("ddosProtection.pills.2"),
              t("ddosProtection.pills.3"),
            ]}
          />
        </div>
      </CompanySection>

      <CompanySection
        eyebrow={t("apiProtection.eyebrow")}
        title={t("apiProtection.title")}
        description={t("apiProtection.description")}
      >
        <div className="space-y-8">
          <CompanySplitList items={apiProtection} />
          <div className="rounded-[1.75rem] border border-zinc-200/80 bg-zinc-950 p-6 text-white">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  {t("apiProtection.platformLabel")}
                </div>
                <div className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{t("apiProtection.platformTitle")}</div>
                <p className="mt-4 text-sm leading-7 text-white/68">{t("apiProtection.platformDescription")}</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/68">
                {t("apiProtection.platformTag")}
              </div>
            </div>
          </div>
        </div>
      </CompanySection>

      <CompanySection
        eyebrow={t("identityProtection.eyebrow")}
        title={t("identityProtection.title")}
        description={t("identityProtection.description")}
        tone="muted"
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <CompanySplitList items={identityProtection} />
          <div className="rounded-[1.75rem] border border-zinc-200/80 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.24)]">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
              <KeyRound className="h-5 w-5" />
            </div>
            <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{t("identityProtection.sideLabel")}</div>
            <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-zinc-950">{t("identityProtection.sideTitle")}</div>
            <p className="mt-4 text-sm leading-7 text-zinc-600">{t("identityProtection.sideDescription")}</p>
          </div>
        </div>
      </CompanySection>

      <CompanySection
        eyebrow={t("dnsProtection.eyebrow")}
        title={t("dnsProtection.title")}
        description={t("dnsProtection.description")}
      >
        <CompanyCardGrid items={dnsProtection} columns="two" />
      </CompanySection>

      <CompanySection
        eyebrow={t("botProtection.eyebrow")}
        title={t("botProtection.title")}
        description={t("botProtection.description")}
        tone="muted"
      >
        <div className="space-y-8">
          <CompanySplitList items={botProtection} />
          <CompanyPillList
            items={[
              t("botProtection.pills.0"),
              t("botProtection.pills.1"),
              t("botProtection.pills.2"),
              t("botProtection.pills.3"),
              t("botProtection.pills.4"),
            ]}
          />
        </div>
      </CompanySection>

      <CompanySection
        eyebrow={t("securityOperations.eyebrow")}
        title={t("securityOperations.title")}
        description={t("securityOperations.description")}
        tone="dark"
      >
        <SecurityOperationsBoard
          title={t("securityOperations.board.title")}
          subtitle={t("securityOperations.board.subtitle")}
          liveLabel={t("securityOperations.board.liveLabel")}
          trafficProfileLabel={t("securityOperations.board.trafficProfileLabel")}
          adaptiveLabel={t("securityOperations.board.adaptiveLabel")}
          events={[
            { label: t("securityOperations.board.events.0.label"), value: t("securityOperations.board.events.0.value") },
            { label: t("securityOperations.board.events.1.label"), value: t("securityOperations.board.events.1.value") },
            { label: t("securityOperations.board.events.2.label"), value: t("securityOperations.board.events.2.value") },
            { label: t("securityOperations.board.events.3.label"), value: t("securityOperations.board.events.3.value") },
          ]}
          metrics={[
            { label: t("securityOperations.board.metrics.0.label"), value: t("securityOperations.board.metrics.0.value") },
            { label: t("securityOperations.board.metrics.1.label"), value: t("securityOperations.board.metrics.1.value") },
            { label: t("securityOperations.board.metrics.2.label"), value: t("securityOperations.board.metrics.2.value") },
            { label: t("securityOperations.board.metrics.3.label"), value: t("securityOperations.board.metrics.3.value") },
          ]}
        />
      </CompanySection>

      <CompanySection
        eyebrow={t("useCases.eyebrow")}
        title={t("useCases.title")}
        description={t("useCases.description")}
      >
        <CompanyCardGrid items={useCases} />
      </CompanySection>

      <CompanySection
        eyebrow={t("activation.eyebrow")}
        title={t("activation.title")}
        description={t("activation.description")}
        tone="muted"
      >
        <ActivationFlow steps={activationSteps} note={t("activation.note")} />
      </CompanySection>

      <CompanySection
        eyebrow={t("ecosystem.eyebrow")}
        title={t("ecosystem.title")}
        description={t("ecosystem.description")}
      >
        <CompanyCardGrid items={ecosystem} />
      </CompanySection>

      <CompanyFinalCta
        eyebrow={t("finalCta.eyebrow")}
        title={t("finalCta.title")}
        description={t("finalCta.description")}
        actions={finalActions}
      />
    </CompanyPageShell>
  );
}
