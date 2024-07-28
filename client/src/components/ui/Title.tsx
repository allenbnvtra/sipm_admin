interface TitleProps {
  title: string;
}

const Title = ({ title }: TitleProps) => {
  return <h2 className='text-xl font-semibold text-slate-700'>{title}</h2>;
};

export default Title;
