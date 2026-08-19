import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})


// Name: <input type="text" placeholder='Enter a Name' />
// Email: <input type="text" placeholder='Enter a Email' />
// Expiriance: <input type="text" placeholder='Enter a Expiriance' />
// Skills: <input type="text" placeholder='Enter a skills' />
// Education: <input type="text" placeholder='Enter a Education' />
// Projects-name: <input type="text" placeholder='Enter a Projects-name' />
// Projects-Discription-Links:<textarea name="" id="">Projects-Discription-Links</textarea>


