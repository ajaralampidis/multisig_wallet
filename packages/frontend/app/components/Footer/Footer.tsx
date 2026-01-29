import { ProposalsList } from './ProposalsList'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

export function Footer() {
  return (
    <>
      <ProposalsList />

      <div className="w-full border-t border-fuchsia-400 bg-violet-200 py-2 text-center text-fuchsia-600/70">
        <p>
          Made with ❤︎⁠ by{' '}
          <a
            className="text-fuchsia-700 underline hover:text-fuchsia-900"
            href="https://github.com/ajaralampidis"
            target="_blank"
          >
            ajaralampidis
            <ArrowTopRightOnSquareIcon className="mb-1 ml-1 inline size-4 align-middle" />
          </a>
        </p>
      </div>
    </>
  )
}
