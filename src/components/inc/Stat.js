import React, { Component } from 'react'

class Stat extends Component {

  render() {
    let stat = this.props.stat;
    return (
      <div className="w-1/2 md:w-1/3 lg:w-1/6 py-3 px-3">
          <div className={` ${ stat.color }  rounded p-4 `}>
              <div className="flex flex-row items-center">
                  <div className="flex-1 text-right">
                      <h5 className="text-blue-200 uppercase text-sm font-thin">{ stat.title }</h5>
                      <h3 className="text-xl">{ stat.value }</h3>
                  </div>
              </div>
          </div>
      </div>
  )
  }
}

export default Stat;
