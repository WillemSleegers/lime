type LoadingDotsProps = {
  text?: string
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ text }) => (
  <div className="flex items-center space-x-1">
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-3 h-3 bg-primary rounded-full animate-pulse delay-200 duration-1000"
        />
      ))}
    </div>
    {text && <span className="ml-3 font-medium">{text}</span>}
  </div>
)

export default LoadingDots
