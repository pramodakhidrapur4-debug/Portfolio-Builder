import React, { useState, useEffect } from 'react'
import './Dark.css'
import { useParams } from 'react-router-dom'
import { iddata } from '../../../api.js'
import Avatar from '../../../Avatar/Avatar'

const Dark = () => {
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
      <div className="Dark-mode template-loading">
        <div className="loader-ring"></div>
      </div>
    )
  }

  return (
    <div className="Dark-mode">

      {/* NAV */}
      <nav className="navv">
        <a >Home</a>
        <a href="#pa">Projects &amp; Activitys</a>
        <a href="#se">Skills &amp; Education</a>
        <a href="#co">Contact Me</a>
      </nav>

      {/* HERO */}
      <div className="home-page">
        <div className="short-info">
          <p className="greeting-tag">👋 Welcome to my Portfolio</p>
          <h1>
            Hello, I'm <br />
            <span className="hero-name">{inpu.name || 'Your Name'}</span>
          </h1>
          <h2 className="hero-profession">{inpu.profession || 'Your Profession'}</h2>
          <p className="hero-tagline">Who Solves Problems Through Designs</p>
        </div>

        <div className="profile-img-wrap">
          <Avatar 
            src={inpu.profileImg} 
            name={inpu.name} 
            className="profile-img" 
            fallbackClassName="profile-img-placeholder" 
          />
        </div>
      </div>

      {/* PROJECTS */}
      <section id="pa">
        <h2 className="he">Projects &amp; Activitys</h2>
        <div className="PA">
          {Projects.length === 0 ? (
            <p className="empty-state">No projects added yet.</p>
          ) : (
            Projects.map((item, index) => (
              <div className="projects-activitys" key={index}>
                <h3>{item.projectName}</h3>
                <p>{item.projectDescription}</p>
                {item.projectImage && (
                  <img
                    src={item.projectImage}
                    alt={item.projectName || 'Project'}
                    className="project-img"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* SKILLS & EDUCATION */}
      <section id="se">
        <h2 className="he">Skills &amp; Education</h2>
        <div className="SE">
          <div className="skill-edu">
            {inpu.collageName && <p className="edu-item">🎓 {inpu.collageName}</p>}
            {inpu.degree && <p className="edu-item">📜 {inpu.degree}</p>}
            {inpu.skills && (
              <div className="skills-wrap">
                {inpu.skills.split(',').map((s, i) => (
                  <span key={i} className="skill-chip">{s.trim()}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="co">
        <h2 className="he">Contact</h2>
        <div className="Contact">
          <p className="contact-text">{inpu.Contact || 'contact info not provided'}</p>
        </div>
      </section>

    </div>
  )
}

export default Dark
