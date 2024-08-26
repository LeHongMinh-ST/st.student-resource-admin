import { Welcome } from '../components/Welcome/Welcome';

export const getStaticProps = async () => ({
  props: {
    layout: 'unloggedIn',
  },
});

export default function HomePage() {
  return <Welcome />;
}
