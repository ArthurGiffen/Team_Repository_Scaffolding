import './About.css'

// Real team roster (JAB TECH). Each person should replace their own `bio`
// with an actual one-liner about themselves — that's intentionally left as
// a placeholder here since only you know what you want it to say.
const members = [
  {
    name: 'Boris Hernandez',
    github: '@Boris713',
    role: 'Backend / API',
    bio: 'Add your own one-line bio here.',
  },
  {
    name: 'Arthur Giffen',
    github: '@ArthurGiffen',
    role: 'Frontend Integration',
    bio: 'Add your own one-line bio here.',
  },
  {
    name: 'Jun Brooks',
    github: '@junbug23',
    role: 'Database & Auth',
    bio: 'Add your own one-line bio here.',
  },
]

function About() {
  return (
    <section>
      <h1>Meet the Team</h1>
      <p className="lead">JAB TECH — the people building Shelf.</p>

      <div className="team">
        {members.map((m) => (
          <article className="member" key={m.name}>
            <h3 className="member__name">{m.name}</h3>
            <span className="member__role">{m.role}</span>
            <p className="member__bio">{m.bio}</p>
            <a
              className="member__github"
              href={`https://github.com/${m.github.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
            >
              {m.github}
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

export default About
