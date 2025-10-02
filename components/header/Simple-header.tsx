import { Header } from './Header';

export async function SimpleHeader() {
  return <Header key='simple-header' hasSearch={false} hasCartBtn={false} />;
}
