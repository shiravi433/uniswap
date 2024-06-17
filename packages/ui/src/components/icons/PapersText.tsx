import { Path, Svg } from 'react-native-svg'

// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import { createIcon } from '../factories/createIcon'

export const [PapersText, AnimatedPapersText] = createIcon({
  name: 'PapersText',
  getIcon: (props) => (
    <Svg fill="none" viewBox="0 0 20 20" {...props}>
      <Path
        d="M13.2601 18.3918C12.9161 18.5558 12.5141 18.6779 12.0591 18.7599L5.48907 19.9099C3.29907 20.2999 2.00896 19.3999 1.62896 17.2099L0.0891657 8.45987C-0.300834 6.26987 0.599117 4.97988 2.78912 4.58988L4.58697 4.27384C4.79197 4.23784 4.97114 4.41686 4.93414 4.62186L3.75811 11.2799C3.22811 14.3099 4.65803 16.3499 7.67803 16.8799C7.67803 16.8799 12.8971 17.7969 13.1661 17.8489C13.4981 17.9088 13.5511 18.2628 13.2601 18.3918ZM19.9131 5.10587L18.3689 13.8598C17.997 15.9678 16.7811 16.8688 14.7361 16.5888C14.6581 16.5778 14.5881 16.5779 14.5071 16.5639L7.94195 15.4059C5.75295 15.0199 4.85209 13.7329 5.23809 11.5439L6.58111 3.92783L6.78204 2.78983C7.16804 0.600828 8.4551 -0.300151 10.6441 0.0858488L17.21 1.24387C19.398 1.62987 20.2991 2.91787 19.9131 5.10587ZM13.554 11.8958C13.626 11.4878 13.3541 11.0988 12.9461 11.0268L8.8421 10.3028C8.4361 10.2298 8.04518 10.5039 7.97418 10.9109C7.90218 11.3189 8.17409 11.7079 8.58209 11.7799L12.6861 12.5039C12.7301 12.5119 12.7739 12.5149 12.8169 12.5149C13.1739 12.5159 13.49 12.2598 13.554 11.8958ZM16.597 9.03482C16.669 8.62682 16.3971 8.23787 15.9891 8.16587L9.42413 7.00785C9.02013 6.93685 8.62696 7.20888 8.55596 7.61588C8.48396 8.02388 8.75612 8.41284 9.16412 8.48484L15.7291 9.64286C15.7731 9.65086 15.8172 9.65384 15.8602 9.65384C16.2172 9.65384 16.533 9.39782 16.597 9.03482ZM17.2972 5.77286C17.3692 5.36486 17.097 4.97584 16.689 4.90384L10.1241 3.74582C9.72008 3.67382 9.32716 3.94685 9.25616 4.35385C9.18416 4.76185 9.45607 5.15087 9.86407 5.22287L16.429 6.38083C16.473 6.38883 16.5171 6.39188 16.5601 6.39188C16.9171 6.39288 17.2332 6.13686 17.2972 5.77286Z"
        fill={'currentColor' ?? '#F5F6FC'}
      />
    </Svg>
  ),
  defaultFill: '#F5F6FC',
})
