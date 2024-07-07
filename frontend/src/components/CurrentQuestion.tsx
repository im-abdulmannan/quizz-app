
interface Question {
  id: number;
  title: string;
}

const CurrentQuestion = ({question}: {question: Question}) => {
  return (
    <div>
        {JSON.stringify(question)}
    </div>
  )
}

export default CurrentQuestion