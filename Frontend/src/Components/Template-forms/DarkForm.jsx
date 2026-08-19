import React, { useState } from 'react';
import './DarkForm.css';
import { useNavigate } from 'react-router-dom';
import { Formda } from '../api.js';
import { PageOverlayLoader, ButtonSpinner } from '../Loader/Loader';

const DarkForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  const [Projects, setProjects] = useState([
    {
      Projectname: "",
      ProjectDiscription: "",
      projectimage: "",
    }
  ]);

  const [inpu, setinpu] = useState({
    Name: "",
    Profession: "",
    Projects: [],
    CollageName: "",
    Degreename: "",
    Skills: "",
    Contactinfo: "",
    profileimage: ""
  });

  const Formfet = async (template) => {
    const formData = new FormData();
    formData.append("template", template);
    formData.append("name", inpu.Name);
    formData.append("profession", inpu.Profession);
    formData.append("collageName", inpu.CollageName);
    formData.append("degree", inpu.Degreename);
    formData.append("skills", inpu.Skills);
    formData.append("Contact", inpu.Contactinfo);
    formData.append("profileImg", inpu.profileimage);

    const formattedProjects = Projects.map((item) => ({
      projectName: item.Projectname,
      projectDescription: item.ProjectDiscription
    }));

    formData.append("projects", JSON.stringify(formattedProjects));
    Projects.forEach((item) => {
      if (item.projectimage) {
        formData.append("projectImages", item.projectimage);
      }
    });

    const res = await Formda(formData);
    return res;
  };

  const projhandle = (e, index) => {
    const { name, value } = e.target;
    const updatepro = [...Projects];
    updatepro[index][name] = value;
    setProjects(updatepro);
  };

  const imageHandle = (e, index) => {
    const file = e.target.files[0];
    const updateima = [...Projects];
    updateima[index].projectimage = file;
    setProjects(updateima);
  };

  const handleGenerate = async (templateName) => {
    if (!inpu.Name) {
      alert("Please enter your Name");
      return;
    }
    setLoadingMsg(`Uploading Images & Creating ${templateName} Portfolio...`);
    setLoading(true);
    try {
      const res = await Formfet(templateName);
      if (res.data && res.data.id) {
        navigate(`/portfolio/${res.data.id}`);
      } else {
        alert("Failed to create portfolio. Please try again.");
      }
    } catch (err) {
      console.error("Portfolio creation error:", err);
      alert("Error generating portfolio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const Onsubmit = async (e) => {
    e.preventDefault();
    await handleGenerate("Dark");
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setinpu({ ...inpu, [name]: value });
  };

  return (
    <div>
      {loading && <PageOverlayLoader message={loadingMsg} />}

      <div className="back" onClick={() => { navigate('/') }}>
        Go Back
      </div>

      <form onSubmit={Onsubmit}>
        <div className="inp">
          <input
            type="text"
            placeholder="Name *"
            value={inpu.Name}
            onChange={handlechange}
            name="Name"
            required
          />
          <input
            type="text"
            placeholder="Profession"
            value={inpu.Profession}
            onChange={handlechange}
            name="Profession"
          />

          {/* --- PROJECT INPUTS SECTION --- */}
          {Projects.map((Project, index) => (
            <div className="gp" key={index}>
              <h2>Project {index + 1}</h2>
              <input
                type="text"
                placeholder="Project Name"
                value={Project.Projectname}
                onChange={(e) => projhandle(e, index)}
                name="Projectname"
              />
              <input
                type="text"
                placeholder="Project Description"
                value={Project.ProjectDiscription}
                onChange={(e) => projhandle(e, index)}
                name="ProjectDiscription"
              />
              <input
                type="file"
                placeholder="Project Image"
                onChange={(e) => imageHandle(e, index)}
                name="projectimage"
              />
            </div>
          ))}

          <p
            onClick={() =>
              setProjects([
                ...Projects,
                {
                  Projectname: "",
                  ProjectDiscription: "",
                  projectimage: ""
                }
              ])
            }
          >
            + Add Project
          </p>

          <input
            type="text"
            placeholder="College Name"
            value={inpu.CollageName}
            onChange={handlechange}
            name="CollageName"
          />
          <input
            type="text"
            placeholder="Degree Name"
            value={inpu.Degreename}
            onChange={handlechange}
            name="Degreename"
          />
          <input
            type="text"
            placeholder="Skills (e.g. React, Node.js, Python)"
            value={inpu.Skills}
            onChange={handlechange}
            name="Skills"
          />
          <input
            type="text"
            placeholder="Contact Info & Social Links (e.g. GitHub / LinkedIn)"
            value={inpu.Contactinfo}
            onChange={handlechange}
            name="Contactinfo"
          />

          <p>Profile Image</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setinpu({
                ...inpu,
                profileimage: file
              });
            }}
            name="profileimage"
          />

          <div className="btnn">
            <div className="submit">
              <button type="submit" disabled={loading}>
                {loading ? <ButtonSpinner label="Creating Dark Portfolio..." /> : "Generate Dark Portfolio"}
              </button>
            </div>

            <button
              type="button"
              className="submit"
              disabled={loading}
              onClick={() => handleGenerate("Light")}
            >
              {loading ? <ButtonSpinner label="Creating Light..." /> : "Generate Light Portfolio"}
            </button>

            <button
              type="button"
              className="submit"
              disabled={loading}
              onClick={() => handleGenerate("Modern")}
            >
              {loading ? <ButtonSpinner label="Creating Modern..." /> : "Generate Modern Portfolio"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DarkForm;