import { View, Text, ScrollView } from 'react-native'
import TopSellingProducts from '../../../components/sales/TopSellingProducts'
import SalesTable from '~/components/sales/SalesTable'

const Home = () => {
    return (
        <ScrollView className="flex-1">
            <TopSellingProducts />
            <SalesTable />
        </ScrollView>
    )
}

export default Home