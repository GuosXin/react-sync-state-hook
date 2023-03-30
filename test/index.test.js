import renderer from 'react-test-renderer';
import Index from './components/index';
// import { useSyncState } from '../src/index'

it('测试', function() {
    const component = renderer.create(
        <Index/>
    )

//     let tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
// console.log(component)
// console.log(component.root)
// console.log(component.toTree().rendered.props.children)
    // const [state, setState] = useSyncState(0)

    // console.log(state)
})