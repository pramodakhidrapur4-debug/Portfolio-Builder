import React, { useState, useEffect } from 'react'
import './Light.css'
import { useParams } from 'react-router-dom'
import { iddata } from '../../../api.js'
import Avatar from '../../../Avatar/Avatar'

const Light = () => {
  const { id } = useParams()

  const [inpu, setInpu] = useState({
    name: '',
    profession: '',
    collageName: '',
    degree: '',
    skills: '',
    Contact: '',
    profileImg: '',
  })
  const [Projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || id === 'undefined') {
      setLoading(false)
      return
    }
    const fetchPortfolio = async () => {
      try {
        const res = await iddata(id)
        if (res.data?.success && res.data?.data) {
          setInpu(res.data.data)
          setProjects(res.data.data.projects || [])
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolio()
  }, [id])

  if (loading) {
    return (
      <div className="Light-mode template-loading">
        <div className="loader-ring light-loader"></div>
      </div>
    )
  }

  return (
    <div className="Light-mode">

      {/* NAV */}
      <nav className="navv-light">
        <a href="/">Home</a>
        <a href="#pa-light">Projects &amp; Activitys</a>
        <a href="#se-light">Skills &amp; Education</a>
        <a href="#co-light">Contact Me</a>
      </nav>

      {/* HERO */}
      <div className="home-page-light">
        <div className="short-info-light">
          <p className="greeting-tag-light">👋 Welcome to my Portfolio</p>
          <h1>
            Hello, I'm <br />
            <span className="hero-name-light">{inpu.name || 'Your Name'}</span>
          </h1>
          <h2 className="hero-profession-light">{inpu.profession || 'Your Profession'}</h2>
          <p className="hero-tagline-light">Who Solves Problems Through Designs</p>
        </div>

        <div className="profile-img-wrap-light">
          <Avatar 
            src={inpu.profileImg} 
            name={inpu.name} 
            className="profile-img-light" 
            fallbackClassName="profile-img-placeholder-light" 
          />
        </div>
      </div>

      {/* PROJECTS */}
      <section id="pa-light">
        <h2 className="he-light">Projects &amp; Activitys</h2>
        <div className="PA-light">
          {Projects.length === 0 ? (
            <p className="empty-state-light">No projects added yet.</p>
          ) : (
            Projects.map((item, index) => (
              <div className="projects-activitys-light" key={index}>
                <h3>{item.projectName}</h3>
                <p>{item.projectDescription}</p>
                {item.projectImage && (
                  <img
                    src={item.projectImage}
                    alt={item.projectName || 'Project'}
                    className="project-img-light"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* SKILLS & EDUCATION */}
      <section id="se-light">
        <h2 className="he-light">Skills &amp; Education</h2>
        <div className="SE-light">
          <div className="skill-edu-light">
            {inpu.collageName && <p className="edu-item-light">🎓 {inpu.collageName}</p>}
            {inpu.degree && <p className="edu-item-light">📜 {inpu.degree}</p>}
            {inpu.skills && (
              <div className="skills-wrap-light">
                {inpu.skills.split(',').map((s, i) => (
                  <span key={i} className="skill-chip-light">{s.trim()}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="co-light">
        <h2 className="he-light">Contact</h2>
        <div className="Contact-light">
          <p className="contact-text-light">{inpu.Contact || 'contact info not provided'}</p>
        </div>
      </section>

    </div>
  )
}

export default Light
