import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getTools } from '../lib/tools'
import Link from 'next/link'
import Date from '../components/date'

export default function Home({ allTools }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allTools.map(({ id, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/tools/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const allTools = getTools()
  return {
    props: {
      allTools
    }
  }
}
