import './About.css'

const members = [
  {
    name: 'Boris Hernandez',
    github: '@Boris713',
    role: 'Backend / Authentication',
  },
  {
    name: 'Arthur Giffen',
    github: '@ArthurGiffen',
    role: 'Database & Backend',
  },
  {
    name: 'Jun Brooks',
    github: '@junbug23',
    role: 'Frontend Integration',
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
