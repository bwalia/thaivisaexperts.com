import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { ClientMessages } from "@/components/ClientMessages";
import { buildMetadata } from "@/lib/metadata";
import { CONTACT_EMAIL } from "@/lib/site";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "contact" });
  return buildMetadata({
    locale,
    path: "contact",
    title: t("metaTitle"),
    description: t("metaDescription"),
    absoluteTitle: true,
  });
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale });
  return (
    <>
      <PageHeader
        locale={locale}
        title={t("contact.title")}
        intro={t("contact.intro")}
        crumbs={[{ label: t("nav.contact") }]}
        path="contact"
      />
      <div className="container-page py-8">
        <ClientMessages locale={locale} namespaces={["contact"]}>
          <ContactForm email={CONTACT_EMAIL} />
        </ClientMessages>
      </div>
    </>
  );
}
