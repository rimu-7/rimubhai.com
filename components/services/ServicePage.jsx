"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import { MessageDialog } from "@/components/hero/Message.Dialog";
import { HoverUnderline } from "@/components/HoverUnderline";

import {
    ArrowRight,
    Mail,
    Sparkles,
    ExternalLink,
    CheckCircle2,
    Code2,
    LayoutDashboardIcon,
    ShoppingCart,
    LayoutDashboard,
    Server,
    Star,
    CheckCheck,
    Briefcase,
    Smile,
    FileSearch,
    Palette,
    Code,
    Rocket,
    ArrowUpFromLine,
    File,
    Building2,
    Activity,
    Notebook,
    HelpCircle,
} from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

// --- Configuration & Helpers ---

const iconMap = {
    Code2,
    Sparkles,
    ArrowRight,
    LayoutDashboardIcon,
    ShoppingCart,
    LayoutDashboard,
    Server,
    Star,
    CheckCheck,
    Briefcase,
    Smile,
    FileSearch,
    Palette,
    Code,
    Rocket,
    Mail,
    ExternalLink,
    CheckCircle2,
    ArrowUpFromLine,
    File,
    Building2,
    Activity,
    Notebook,
};

// Safe icon resolver with a fallback
const getIcon = (iconName) => iconMap[iconName] || HelpCircle;

const ANIMATION_DURATIONS = {
    enter: 0.4,
    stagger: 0.1,
};

const variants = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: ANIMATION_DURATIONS.stagger,
                delayChildren: 0.1,
            },
        },
    },
    item: {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: ANIMATION_DURATIONS.enter },
        },
    },
};

// --- Sub-components ---

function TechCategory({ title, data }) {
    if (!data?.length) return null;

    return (
        <div className="w-full">
            <h3 className="text-lg font-semibold text-muted-foreground mb-6 uppercase tracking-wider">
                {title}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {data.map((tech) => (
                    <motion.div
                        key={tech.name}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        whileHover={{
                            backgroundColor: "rgba(var(--primary), 0.03)",
                        }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center gap-3 p-6 hover:outline border-0.5 grayscale hover:grayscale-0 rounded-md transition-colors"
                    >
                        <div className="relative w-10 h-10 flex items-center justify-center transition-all duration-300">
                            <Image
                                src={tech.url}
                                alt={`${tech.name} logo`}
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                        </div>
                        <span className="text-sm font-medium text-foreground text-center">
                            {tech.name}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function HeroSection({ data }) {
    if (!data) return null;

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-border">
            <div className="absolute inset-0 z-0">
                <Image
                    src={data.bgImage}
                    alt={`${data.title} Background`}
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-4xl mx-auto relative z-10 py-24 text-center space-y-10 text-white"
            >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold  leading-tight tracking-tight">
                    {data.title} <span className="">{data.titleHighlight}</span>
                </h1>

                <div className="space-y-6">
                    <p className="text-xl md:text-2xl  max-w-2xl mx-auto font-medium">
                        {data.subtitle}
                    </p>
                    <p className="text-base text-white/70  max-w-2xl mx-auto leading-relaxed">
                        {data.description}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 text-sm ">
                    {data.features?.map((feature, idx) => {
                        const FeatureIcon = getIcon(feature.icon);
                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-2 bg-muted/50 border border-border px-4 py-2"
                            >
                                <FeatureIcon className="h-4 w-4 " />
                                {feature.text}
                            </div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
                >
                    <MessageDialog>
                        <Button className="rounded-md px-8 py-6 text-lg transition-all duration-300 group">
                            <HoverUnderline>
                                <Mail className="mr-2 h-5 w-5 inline-block" />
                                {data.cta?.primary?.text || "Contact Us"}
                            </HoverUnderline>
                            <ArrowRight className="ml-2 h-5 w-5 inline-block transition-transform group-hover:translate-x-1" />
                        </Button>
                    </MessageDialog>

                    {data.cta?.secondary && (
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="rounded-md text-lg px-8 py-6 bg-transparent hover:bg-muted transition-all duration-300"
                        >
                            <Link href={data.cta.secondary.href}>
                                {data.cta.secondary.text}
                            </Link>
                        </Button>
                    )}
                </motion.div>
            </motion.div>
        </section>
    );
}

function ServicesSection({ company, services }) {
    if (!company || !services?.length) return null;

    return (
        <section className="py-24 bg-background border-b border-border">
            <Container>
                <motion.div
                    variants={variants.container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="flex flex-col gap-20"
                >
                    <motion.div
                        variants={variants.item}
                        className="text-center max-w-3xl mx-auto space-y-6"
                    >
                        <p className="text-primary text-sm font-bold tracking-widest uppercase">
                            {company.intro}
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            {company.heading}
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            {company.description}
                        </p>
                        <div className="w-16 h-1 bg-primary mx-auto" />
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0.5">
                        {services.map((service) => {
                            const ServiceIcon = getIcon(service.icon);
                            return (
                                <motion.div
                                    key={service.title}
                                    variants={variants.item}
                                    className="group relative p-10 rounded-md hover:outline hover:bg-muted/30 transition-colors duration-300"
                                >
                                    <div className="mb-8 w-14 h-14 border rounded-xl border-border flex items-center justify-center text-primary bg-background group-hover:border-primary transition-colors">
                                        <ServiceIcon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground mb-4">
                                        {service.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {service.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </Container>
        </section>
    );
}

function WhyChooseUsSection({ data }) {
    if (!data) return null;

    return (
        <section className="py-24 bg-background border-b border-border">
            <Container>
                <motion.div
                    variants={variants.container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                >
                    <motion.div variants={variants.item} className="space-y-10">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                                {data.title}
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {data.description}
                            </p>
                        </div>

                        <ul className="space-y-5">
                            {data.features?.map((feature, index) => (
                                <motion.li
                                    key={index}
                                    variants={variants.item}
                                    className="flex items-start gap-4 group"
                                >
                                    <div className="shrink-0 mt-1">
                                        <div className="w-6 h-6 flex items-center justify-center text-primary">
                                            <CheckCircle2 className="h-5 w-5 bg-green-400 group-hover:bg-green-600 duration-300  rounded-full text-white" />
                                        </div>
                                    </div>
                                    <span className="text-foreground leading-relaxed">
                                        {feature}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>

                        <motion.div
                            variants={variants.item}
                            className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-10 border-t border-border"
                        >
                            {data.stats?.map((stat, index) => {
                                const StatIcon = getIcon(stat.icon);
                                return (
                                    <div
                                        key={index}
                                        className="text-left flex flex-col"
                                    >
                                        <StatIcon className="h-5 w-5 mb-3 text-primary" />
                                        <p className="text-3xl font-bold text-foreground tracking-tight">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider font-semibold">
                                            {stat.label}
                                        </p>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={variants.item}
                        className="w-full h-150 rounded-md relative border border-border p-4 bg-muted/10"
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={data.image}
                                alt="Why choose us"
                                fill
                                className="object-cover grayscale rounded-sm hover:grayscale-0 transition-all duration-700"
                                loading="lazy"
                                quality={90}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </Container>
        </section>
    );
}

function ProcessSection({ data }) {
    if (!data) return null;

    return (
        <section className="py-24 bg-muted/10 border-b border-border overflow-hidden">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: ANIMATION_DURATIONS.enter }}
                    className="text-center max-w-2xl mx-auto mb-20"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                        {data.header?.title}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {data.header?.subtitle}
                    </p>
                </motion.div>

                <motion.div
                    variants={variants.container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 mb-24"
                >
                    {data.steps?.map((step, index) => {
                        const StepIcon = getIcon(step.icon);
                        return (
                            <motion.div
                                key={step.number}
                                variants={variants.item}
                                className={`relative flex flex-col items-center group text-center group p-8 lg:border-r border-border ${
                                    index === data.steps.length - 1
                                        ? "lg:border-r-0"
                                        : ""
                                }`}
                            >
                                <div className="relative z-10 mb-8">
                                    <div className="relative w-20 h-20 rounded-2xl border border-border bg-background flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                                        <StepIcon className="h-8 w-8 text-foreground group-hover:text-primary transition-colors duration-300" />
                                    </div>
                                    <div className="absolute rounded-full -top-3 -right-3 w-8 h-8 group-hover:bg-primary duration-300 bg-primary/50 text-primary-foreground text-sm font-bold flex items-center justify-center shadow-sm">
                                        {step.number}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-4">
                                    {step.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: ANIMATION_DURATIONS.enter,
                        delay: 0.2,
                    }}
                    className="relative bg-card border border-border rounded-md p-10 text-center"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto gap-8">
                        <h3 className="text-2xl font-bold text-foreground text-left">
                            {data.cta?.title}
                        </h3>
                        <MessageDialog>
                            <Button className="rounded-md px-8 py-6 text-base group whitespace-nowrap">
                                <HoverUnderline>
                                    <span>
                                        {data.cta?.buttonText || "Get Started"}
                                    </span>
                                </HoverUnderline>
                                <ExternalLink className="h-4 w-4 ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Button>
                        </MessageDialog>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
}

// --- Main Template Component ---

export default function ServicePageTemplate({ data }) {
    // Defensive check for root data object
    if (!data)
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );

    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <HeroSection data={data.hero} />

            <ServicesSection company={data.company} services={data.services} />

            <section className="py-24 bg-muted/5 border-b border-border">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: ANIMATION_DURATIONS.enter }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Technology Stack
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            We leverage modern architectures and
                            high-performance frameworks to build robust,
                            scalable applications.
                        </p>
                    </motion.div>

                    <div className="space-y-16">
                        <TechCategory
                            title="Frontend"
                            data={data.techStack?.frontend}
                        />
                        <TechCategory
                            title="Backend"
                            data={data.techStack?.backend}
                        />
                        <TechCategory
                            title="Databases"
                            data={data.techStack?.databases}
                        />
                        <TechCategory
                            title="Cloud & Infrastructure"
                            data={data.techStack?.CloudPlatforms}
                        />
                    </div>
                </Container>
            </section>

            <WhyChooseUsSection data={data.whyChooseUs} />

            <ProcessSection data={data.processData} />

            {data.faqData?.questions?.length > 0 && (
                <section className="py-24 bg-background border-b border-border">
                    <Container>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: ANIMATION_DURATIONS.enter }}
                            className="mx-auto"
                        >
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                    {data.faqData.header?.title}
                                </h2>
                                <p className="text-lg text-muted-foreground">
                                    {data.faqData.header?.subtitle}
                                </p>
                            </div>

                            <Accordion
                                type="single"
                                collapsible
                                className="w-full space-y-4"
                            >
                                {data.faqData.questions.map((item, index) => (
                                    <AccordionItem
                                        key={index}
                                        value={`item-${index}`}
                                        className="border border-border bg-card px-6 rounded-md data-[state=open]:border-primary transition-colors"
                                    >
                                        <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                                            {item.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                                            {item.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </motion.div>
                    </Container>
                </section>
            )}

            {/* FINAL CTA */}
            <section className="relative w-full py-24 bg-foreground text-background border-t border-border">
                <Container className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: ANIMATION_DURATIONS.enter }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                            Ready to Transform Your Architecture?
                        </h2>
                        <p className="text-lg md:text-xl text-background/70 mb-10 leading-relaxed font-medium">
                            Let's discuss how our scalable solutions can help
                            you achieve your technical objectives.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <MessageDialog>
                                <Button className="rounded-md px-8 py-6 text-lg border border-transparent bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 group">
                                    <HoverUnderline>
                                        <Sparkles className="mr-2 h-5 w-5 inline-block" />
                                        Get Free Consultation
                                    </HoverUnderline>
                                    <ArrowRight className="ml-2 h-5 w-5 inline-block transition-transform group-hover:translate-x-1" />
                                </Button>
                            </MessageDialog>

                            {data.hero?.cta?.secondary && (
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="rounded-md text-lg px-8 py-6 bg-transparent text-background border-background/30 hover:bg-background/10 hover:text-background transition-all duration-300"
                                >
                                    <Link href={data.hero.cta.secondary.href}>
                                        {data.hero.cta.secondary.text}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </Container>
            </section>
        </div>
    );
}
