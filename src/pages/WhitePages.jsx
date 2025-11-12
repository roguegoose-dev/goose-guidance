// src/pages/WhitePages.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function WhitePages() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Where Work Meets Thought
          </h1>

          <section className="space-y-4 text-lg leading-relaxed">
            <p>
              The White Pages are not a polished blog. They are a workspace for
              thinking in public. This is where I map out ideas, explore
              systems, and put words to what is being built behind the scenes at
              Guidance Goose.
            </p>
            <p>
              It is not about perfection. It is about process. The White Pages
              are where I step back from the code, the data, the design, or the
              fieldwork and ask what all of it means.
            </p>
            <p className="italic">Here I write to understand.</p>
          </section>

          <hr className="my-10 border-gray-300" />

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Why It Exists</h2>
            <p>
              The White Pages exist to slow down the noise and make sense of the
              work.
            </p>
            <p>
              Every project begins with a reason, and that reason deserves space
              before it becomes a finished product or a headline. This page is
              that space.
            </p>
            <p>
              It is where I record what I am learning, what is working, and what
              still needs clarity. It is a place to connect the big picture with
              the small, deliberate actions that move it forward.
            </p>
            <p>
              I believe progress is not made in a rush. It is made in
              reflection, and reflection demands a record.
            </p>
          </section>

          <hr className="my-10 border-gray-300" />

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Who It Is For</h2>
            <p>This is for anyone who builds.</p>
            <p>
              You might write code, lead a team, fight fires, or solve data
              problems. You might be trying to understand how to turn experience
              into skill, or how to move an idea from your head into reality.
            </p>
            <p>
              The White Pages are for people who believe that thinking deeply
              and acting precisely belong in the same sentence.
            </p>
            <p>
              If you are building something real, you will find a rhythm here
              that feels familiar.
            </p>
          </section>

          <hr className="my-10 border-gray-300" />

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">The Approach</h2>
            <p>I write in plain language. I write as if you are across the table.</p>
            <p>
              You will not find marketing here. You will find thoughts in
              motion, lessons learned the hard way, and the logic behind choices
              that shape each project.
            </p>
            <p>
              Some entries will be clean. Some will be messy. All will be honest.
            </p>
            <p>
              The goal is not to show what I know. The goal is to show how I
              learn.
            </p>
          </section>

          <hr className="my-10 border-gray-300" />

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">A Living Record</h2>
            <p>The White Pages will change as I do.</p>
            <p>
              It will grow with every mistake, every lesson, and every build.
              Over time it will become a map of how Guidance Goose came to be
              what it is.
            </p>
            <p>
              If you find something here that makes you stop and think, then the
              work is already doing what it was meant to do.
            </p>
            <p className="font-medium">
              Welcome to the White Pages. <br />
              Welcome to the process.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
