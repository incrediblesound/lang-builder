import React from "react";

const Home = ({ store }) => {
  return (
    <div>
      {
        store.languages.forEach(language => {
          return (
            <div>
              <p>{ language.name}</p>
            </div>
          )
        })
      }
    </div>
  )
}

export default Home