import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          onPress={() => {
            onChange(index);
          }}
          style={{
            flex: 1 /  sections.length,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical:12,
            backgroundColor: selections[index] ? '#EE9972' : '#495E57',
            borderWidth: 2,
            borderColor: 'white',
            
          }}>
          <View>
            <Text style={{ color: selections[index] ? 'black' : 'white', fontSize: 12 }}>
              {section}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
        marginBottom: 16,
        
  },
});

export default Filters;
