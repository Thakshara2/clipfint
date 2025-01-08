import { Container } from "@/components/ui/container";
import Link from "next/link";

export default function AboutPage() {
  return (
    <Container className="py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Clipfint</h1>
        
        <div className="prose dark:prose-invert">
          <p className="text-lg text-muted-foreground mb-6">
            Clipfint is a cutting-edge text-to-speech platform that leverages advanced AI technology to create natural-sounding voices for various applications.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            At Clipfint LLC, we aim to make high-quality text-to-speech technology accessible to everyone, from content creators and educators to professionals seeking to enhance accessibility.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Key Features</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
            <li>Voice Cloning - Create custom voices that match specific requirements</li>
            <li>Multiple Speakers - Support for various voice profiles and languages</li>
            <li>Emotion Control - Add emotional depth to generated speech</li>
            <li>Real-time Generation - Quick and efficient speech synthesis</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="text-muted-foreground">
            Have questions or need support? Visit our <Link href="/contact" className="text-primary hover:underline">contact page</Link> to get in touch with our team.
          </p>
        </div>
      </div>
    </Container>
  );
} 