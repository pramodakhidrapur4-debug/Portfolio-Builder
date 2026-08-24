import React, { useState, useEffect } from 'react'
import './Modern.css'
import { useParams } from 'react-router-dom'
import { iddata } from '../../../api.js'
import Avatar from '../../../Avatar/Avatar'

const Modern = () => {
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
      <div className="Modern-mode template-loading">
        <div className="loader-ring"></div>
      </div>
    )
  }

  return (
    <div className="Modern-mode">

      {/* NAV */}
      <nav className="navv-modern">
        <a>Home</a>
        <a href="#pa-modern">Projects &amp; Activitys</a>
        <a href="#se-modern">Skills &amp; Education</a>
        <a href="#co-modern">Contact Me</a>
      </nav>

      {/* HERO */}
      <div className="home-page-modern">
        <div className="short-info-modern">
          <p className="greeting-tag-modern">👋 Welcome to my Portfolio</p>
          <h1>
            Hello, I'm <br />
            <span className="hero-name-modern">{inpu.name || 'Your Name'}</span>
          </h1>
          <h2 className="hero-profession-modern">{inpu.profession || 'Your Profession'}</h2>
          <p className="hero-tagline-modern">Who Solves Problems Through Designs</p>
        </div>

        <div className="profile-img-wrap-modern">
          <Avatar 
            src={inpu.profileImg} 
            name={inpu.name} 
            className="profile-img-modern" 
            fallbackClassName="profile-img-placeholder-modern" 
          />
        </div>
      </div>

      {/* PROJECTS */}
      <section id="pa-modern">
        <h2 className="he-modern">Projects &amp; Activitys</h2>
        <div className="PA-modern">
          {Projects.length === 0 ? (
            <p className="empty-state-modern">No projects added yet.</p>
          ) : (
            Projects.map((item, index) => (
              <div className="projects-activitys-modern" key={index}>
                <h3>{item.projectName}</h3>
                <p>{item.projectDescription}</p>
                {item.projectImage && (
                  <img
                    src={item.projectImage}
                    alt={item.projectName || 'Project'}
                    className="project-img-modern"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* SKILLS & EDUCATION */}
      <section id="se-modern">
        <h2 className="he-modern">Skills &amp; Education</h2>
        <div className="SE-modern">
          <div className="skill-edu-modern">
            {inpu.collageName && <p className="edu-item-modern">🎓 {inpu.collageName}</p>}
            {inpu.degree && <p className="edu-item-modern">📜 {inpu.degree}</p>}
            {inpu.skills && (
              <div className="skills-wrap-modern">
                {inpu.skills.split(',').map((s, i) => (
                  <span key={i} className="skill-chip-modern">{s.trim()}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="co-modern">
        <h2 className="he-modern">Contact</h2>
        <div className="Contact-modern">
          <p className="contact-text-modern">{inpu.Contact || 'contact info not provided'}</p>
        </div>
      </section>

    </div>
  )
}

export default Modern