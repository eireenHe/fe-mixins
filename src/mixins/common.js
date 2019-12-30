export default {
    data() {
        return {
            productArray: [],
            spuIdArray: [],
            businessPhaseArray: [],
            channelArray: [],
            mainTypeArray: []
        }
    },
    methods: {
        getProductArray() {
            this.request.getAllProducts(({type: 1}))
                .then((res) => {
                    this.productArray = res.data
                })
                .catch((error) => {
                    this.loading = false
                    console.log(error)
                    console.log('getAllProducts failed')
                })
        },
        getSpuIdArray() {
            this.request.getSpuIds()
                .then((res) => {
                    this.spuIdArray = res.data
                })
                .catch((error) => {
                    this.loading = false
                    console.log(error)
                    console.log('getSpuIds failed')
                })
        },
        getBusinessPhaseArray() {
            this.request.getBusinessPhases()
                .then((res) => {
                    this.businessPhaseArray = res.data
                })
                .catch((error) => {
                    this.loading = false
                    console.log(error)
                    console.log('getBusinessPhases failed')
                })
        },
        getChannelArray() {
            this.request.getChannels()
                .then((res) => {
                    this.channelArray = res.data
                })
                .catch((error) => {
                    this.loading = false
                    console.log(error)
                    console.log('getChannels failed')
                })
        },
        getMainTypesArray() {
            this.request.getMainTypes()
                .then((res) => {
                    this.mainTypeArray = res.data
                })
                .catch((error) => {
                    this.loading = false
                    console.log(error)
                    console.log('getMainTypes failed')
                })
        },
    }
}
