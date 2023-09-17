const StarIcon = ({ className }: { className: string }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30' fill='none' className={className}>
      <g>
        <path
          fill='#fff'
          d='M15 0c8.27 0 15 6.73 15 15s-6.73 15-15 15S0 23.273 0 15 6.73 0 15 0zm0 28.873c7.65 0 13.873-6.224 13.873-13.873 0-7.65-6.224-13.87-13.873-13.87C7.35 1.13 1.13 7.35 1.13 15c0 7.65 6.223 13.873 13.872 13.873H15zm0-26.275c6.839 0 12.402 5.563 12.402 12.402 0 6.839-5.563 12.402-12.402 12.402-6.839 0-12.402-5.563-12.402-12.402C2.598 8.161 8.161 2.598 15 2.598zM10.398 16.7l-1.035 4.34c-.084.349-.006.732.21 1.02.216.288.56.473.92.49H10.551c.226 0 .447-.062.642-.182L15 20.041l3.808 2.324c.416.257.963.235 1.362-.055.395-.288.584-.8.471-1.276l-1.035-4.339 3.387-2.899c.374-.316.522-.845.37-1.312a1.236 1.236 0 00-1.068-.842l-4.446-.355-1.713-4.12a1.238 1.238 0 00-1.132-.754c-.49 0-.942.302-1.131.755l-1.714 4.12-4.448.357c-.488.04-.916.38-1.066.84-.152.466-.004.993.368 1.312l3.389 2.9-.004.002zm2.769-4.016L15 8.28l1.833 4.404 4.755.381-3.623 3.102 1.107 4.64L15 18.318l-4.072 2.488 1.107-4.64-3.623-3.102 4.755-.38z'
        ></path>
      </g>
    </svg>
  )
}

export default StarIcon