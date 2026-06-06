import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CommunityStripBlock } from '@/blocks/CommunityStrip/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { CtaCloseBlock } from '@/blocks/CtaClose/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { FrameworkBlock } from '@/blocks/Framework/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { MetricsBandBlock } from '@/blocks/MetricsBand/Component'
import { ProductPreviewBlock } from '@/blocks/ProductPreview/Component'
import { ProofStripBlock } from '@/blocks/ProofStrip/Component'
import { ServicesBlock } from '@/blocks/Services/Component'
import { TestimonialBlock } from '@/blocks/Testimonial/Component'

const blockComponents = {
  archive: ArchiveBlock,
  communityStrip: CommunityStripBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  ctaClose: CtaCloseBlock,
  formBlock: FormBlock,
  framework: FrameworkBlock,
  mediaBlock: MediaBlock,
  metricsBand: MetricsBandBlock,
  productPreview: ProductPreviewBlock,
  proofStrip: ProofStripBlock,
  services: ServicesBlock,
  testimonial: TestimonialBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                // @ts-expect-error there may be some mismatch between the expected types here
                <Block key={index} {...block} disableInnerContainer />
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
