import { View, TextInput, Pressable, Text, FlatList, Linking, RefreshControl, Modal as RNModal, Alert } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { Customer } from '~/types';
import axios from 'axios';
import Toast from 'react-native-root-toast';
import * as SecureStore from 'expo-secure-store';
import { Loader2, Phone, Pencil, Trash } from 'lucide-react-native';
import { MotiView } from 'moti';
import Modal from 'react-native-modal';
import { useForm, Controller } from 'react-hook-form';
import { router } from 'expo-router';

function CustomerCard({ customer, onPress }: { customer: Customer; onPress: () => void }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteCustomer = async () => {
        try {
            setIsDeleting(true);
            await axios.delete(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/customers`, {
                data: { id: customer.id }
            });
            Toast.show('Customer deleted!', {
                backgroundColor: 'green',
                textColor: 'white',
                position: Toast.positions.BOTTOM,
            });
        } catch (error) {
            console.error('Error deleting customer:', error);
            Toast.show('Failed to delete customer', {
                backgroundColor: 'red',
                textColor: 'white',
                position: Toast.positions.BOTTOM,
            });
        } finally {
            setIsDeleting(false);
        }
    }

  return (
    <Pressable onPress={onPress}>
      <View className='p-4 bg-white flex-row justify-between items-center dark:bg-slate-600 bg-gray-300 rounded-xl'>
        <View className="flex flex-row gap-2 items-center">
          <View className="w-14 h-14 bg-gray-200 dark:bg-slate-700 rounded-full flex justify-center items-center">
            <Text className='text-sm font-medium text-white'>{customer.name.charAt(0)}</Text>
          </View>
          <View className="flex flex-col gap-1">
            <Text className='text-base font-medium dark:text-white text-gray-500'>{customer.name}</Text>
            <Text className='text-sm text-gray-500 dark:text-gray-400'>{customer.phone}</Text>
          </View>
        </View>
        <View className="flex flex-row gap-2 items-center">
            <Pressable onPress={() => Linking.openURL(`tel:${customer.phone}`)} className="bg-green-500 p-2 rounded-full">
                <Phone fill="white" size={18} strokeWidth={0} />
            </Pressable>
            <Pressable onPress={() => {
                Alert.alert('Delete Customer', 'Are you sure you want to delete this customer?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', onPress: handleDeleteCustomer }
                ]); 
            }} className={`bg-red-500 p-2 rounded-full ${isDeleting ? 'opacity-50' : ''}`}>
                {isDeleting ? <Loader2 className="animate-spin" size={18} strokeWidth={2} /> : <Trash size={18} strokeWidth={2} color="white" />}
            </Pressable>
            {/* <Pressable onPress={() => {
                router.push(`/modals/customers/${customer.id}`)
            }} className="bg-blue-500 p-2 rounded-full">
                <Pencil fill="white" size={18} strokeWidth={0} />
            </Pressable> */}
        </View>
      </View>
    </Pressable>
  );
}

const Home = () => {
  const [sortBy, setSortBy] = useState<'all' | 'frequent' | 'sales'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const businessId = JSON.parse(SecureStore.getItem('session') || '{}').id;

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/customers`, {
        params: { id: businessId }
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      Toast.show("Failed to fetch customers", {
        backgroundColor: 'red',
        textColor: 'white',
        position: Toast.positions.BOTTOM,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return [...customers]
      .filter((customer: Customer) => {
        if (searchQuery.length > 0) {
          return customer.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
      })
      .sort((a, b) => {
        const totalA = a.sales?.reduce((acc, sale) => acc + sale.total, 0) || 0;
        const totalB = b.sales?.reduce((acc, sale) => acc + sale.total, 0) || 0;

        if (sortBy === 'frequent' || sortBy === 'sales') {
          return totalB - totalA;
        }
        return 0;
      });
  }, [customers, searchQuery, sortBy]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomers();
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      phone: ''
    }
  });

  const openModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    reset({ name: customer.name, phone: customer.phone });
    setIsModalVisible(true);
  };

  const handleUpdateCustomer = async (data: { name: string; phone: string }) => {
    if (!selectedCustomer) return;

    const updatedCustomer = { ...selectedCustomer, ...data };
    setCustomers((prev) =>
      prev.map((c) => (c.id === selectedCustomer.id ? updatedCustomer : c))
    );

    try {
      await axios.put(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/customers`, {
        id: selectedCustomer.id,
        ...data
      });
      Toast.show('Customer updated!', {
        backgroundColor: 'green',
        textColor: 'white',
        position: Toast.positions.BOTTOM,
      });
      setIsModalVisible(false);
    } catch (error) {
      Toast.show('Update failed', {
        backgroundColor: 'red',
        textColor: 'white',
        position: Toast.positions.BOTTOM,
      });
    }
  };

  return (
    <View className='px-2 py-8 flex-1'>
      <TextInput
        placeholder='Search customers...'
        className='p-4 rounded-xl bg-gray-200 dark:bg-slate-800 mb-2'
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View className='flex-row justify-center items-center my-4 gap-1'>
        {(['all', 'frequent', 'sales'] as const).map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setSortBy(filter)}
            className={`px-4 py-2 rounded-full w-1/3 items-center ${
              sortBy === filter ? 'bg-yellow-500' : 'bg-gray-300'
            }`}
          >
            <Text className={`${sortBy === filter ? 'text-white' : 'text-gray-500'} font-medium`}>
              {filter === 'all' ? 'All' : filter === 'frequent' ? 'Frequent' : 'Most Sales'}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View className="gap-4 mt-4">
          {[...Array(5)].map((_, i) => (
            <MotiView
              key={i}
              from={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ loop: true, type: 'timing', duration: 800 }}
              className="h-20 bg-gray-300 dark:bg-slate-600 rounded-xl"
            />
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredCustomers}
          renderItem={({ item }) => <CustomerCard customer={item} onPress={() => openModal(item)} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10, paddingBottom: 50 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      {/* Edit Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
        <View className="p-6 bg-white dark:bg-slate-800 rounded-xl gap-4">
          <Text className="text-xl font-bold dark:text-white mb-2">Edit Customer</Text>

          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="p-4 rounded-xl bg-gray-100 dark:bg-slate-700 dark:text-white"
                placeholder="Customer name"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="p-4 rounded-xl bg-gray-100 dark:bg-slate-700 dark:text-white"
                placeholder="Phone number"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
              />
            )}
          />

          <Pressable
            disabled={isSubmitting}
            onPress={handleSubmit(handleUpdateCustomer)}
            className="bg-yellow-500 rounded-xl py-4 items-center disabled:opacity-50"
          >
            <Text className="text-white font-bold">{isSubmitting ? 'Updating...' : 'Update'}</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default Home;