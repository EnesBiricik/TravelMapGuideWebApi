import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import ImageLight from '../assets/img/create-account-office.jpeg'
import ImageDark from '../assets/img/create-account-office-dark.jpeg'
import { GithubIcon, TwitterIcon } from '../icons'
import { Input, Label, Button } from '@windmill/react-ui'
import axios from 'axios'

function Register() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [profilePhoto, setProfilePhoto] = useState(null) // Dosya için state
  const history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const userRegisterModel = {
      Email: email,
      Username: username,
      Password: password,
      Image: profilePhoto
    }

    try {
      const response = await axios.post('https://localhost:7018/api/User/Register', userRegisterModel, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status === 200) {
        alert('Registration successful')
        history.push('/login')
      }
    } catch (error) {
      console.error('An error occurred!', error)
      alert('Registration failed. Please check your details and try again.')
    }
  }

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Create account
              </h1>
              <form onSubmit={handleSubmit}>
                <Label>
                  <span>Email</span>
                  <Input
                    className="mt-1"
                    type="email"
                    placeholder="enes@ekrem.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Label>
                <Label className="mt-4">
                  <span>Username</span>
                  <Input
                    className="mt-1"
                    placeholder="enes_biricik"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Label>
                <Label className="mt-4">
                  <span>Profile Photo</span>
                  <Input
                    className="mt-1"
                    type="file" // Dosya yükleme için file input
                    onChange={(e) => setProfilePhoto(e.target.files[0])} // Dosyayı set etme
                  />
                </Label>
                <Label className="mt-4">
                  <span>Password</span>
                  <Input
                    className="mt-1"
                    placeholder="***************"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Label>

                <Label className="mt-6" check>
                  <Input type="checkbox" />
                  <span className="ml-2">
                    I agree to the <span className="underline">privacy policy</span>
                  </span>
                </Label>

                <Button type="submit" block className="mt-4">
                  Create account
                </Button>
              </form>

              <hr className="my-8" />

              <Button block layout="outline">
                <GithubIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Github
              </Button>
              <Button block className="mt-4" layout="outline">
                <TwitterIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Twitter
              </Button>

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/login"
                >
                  Already have an account? Login
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Register
