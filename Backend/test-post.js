const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDBmZTRmNTMxMTIzNjE2OGExMDljYSIsImlhdCI6MTc4NzU2NjA5MH0.fu4TIky0v1TMe5-MWfUPUFSiiVIYOn7JPZdcS93wbpY";

async function run() {
  const fd = new FormData();
  fd.append("template", "Dark");
  fd.append("name", "Test");
  fd.append("profession", "Dev");
  fd.append("collageName", "Univ");
  fd.append("degree", "BSc");
  fd.append("skills", "JS");
  fd.append("Contact", "email");
  
  // Create a dummy file
  const blob = new Blob(["test image content"], { type: "image/png" });
  fd.append("profileImg", blob, "profile.png");
  fd.append("projectImages", blob, "project1.png");
  fd.append("projectImages", blob, "project2.png");
  
  fd.append("projects", JSON.stringify([
    { projectName: "P1", projectDescription: "D1" },
    { projectName: "P2", projectDescription: "D2" }
  ]));

  console.log("Sending request...");
  try {
    const res = await fetch("http://localhost:3000/api/form/fill", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        token: token
      },
      body: fd
    });

    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("BODY:", text);
  } catch(e) {
    console.error("Error:", e);
  }
}
run();
