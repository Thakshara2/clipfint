import { Container } from "@/components/ui/container"

export default function About() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">About AudioNext</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            AudioNext is dedicated to revolutionizing the way people interact with audio content. 
            We provide cutting-edge text-to-speech solutions that make content more accessible and engaging.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-2">Text-to-Speech</h3>
              <p className="text-gray-600">
                Transform written content into natural-sounding speech using advanced AI technology.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Voice Cloning</h3>
              <p className="text-gray-600">
                Create custom voices that match your brand or personal preference.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <p className="text-gray-600 mb-6">
            We are a team of passionate developers, designers, and audio engineers working together 
            to create the best possible audio experience for our users.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-600">
            Have questions or want to learn more? Visit our <a href="/contact" className="text-blue-600 hover:underline">contact page</a> or 
            email us at support@audionext.com.
          </p>
        </section>
      </div>
    </Container>
  )
} 